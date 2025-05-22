"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { 
  exerciseTemplate, 
  setTemplate,
  timeDistanceTemplate,
  weightRepsTemplate,
  workout, 
  workoutToWorkoutTag 
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { workoutFormSchema } from "./workout-form.schema"
import { 
  distanceToMillimeters, 
  timeToMilliseconds, 
  weightToGrams 
} from "./unit-converter"

export const createWorkoutTemplate = async (values: z.infer<typeof workoutFormSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  console.log(JSON.stringify(values))

  await db.transaction(async tx => {
    if (values.id != undefined) {
      await tx.delete(workout).where(eq(workout.id, values.id))
    }

    const workoutTemplate = await tx.insert(workout).values({
      name: values.name,
      userId: userId,
      notes: values.notes
    }).returning({ id: workout.id })

    const workoutTemplateId = workoutTemplate[0].id

    if (values.tagIds.length > 0) {
      const tagInsertValues = values.tagIds.map(tagId => ({
        workoutId: workoutTemplateId,
        workoutTagId: tagId
      }))

      await tx.insert(workoutToWorkoutTag).values(tagInsertValues)
    }

    for (const [index, exercise] of values.exercises.entries()) {
      if (exercise.type === "weightReps") {
        const exerciseTemplateRes = await tx.insert(exerciseTemplate).values({
          userId: userId,
          workoutId: workoutTemplateId,
          exerciseId: exercise.exerciseId,
          notes: values.notes,
          orderNumber: index
        }).returning({ id: exerciseTemplate.id })

        const exerciseTemplateId = exerciseTemplateRes[0].id

        for (const [index, set] of exercise.sets.entries()) {
          const setTemplateRes = await tx.insert(setTemplate).values({
            exerciseTemplateId: exerciseTemplateId,
            orderNumber: index
          }).returning({ id: setTemplate.id })

          const setTemplateId = setTemplateRes[0].id

          const weightInGrams = weightToGrams[exercise.units.weight](
            set.weight
          )

          await tx.insert(weightRepsTemplate).values({
            setTemplateId: setTemplateId,
            weight: Math.round(weightInGrams),
            reps: set.reps
          })
        }


      } else if (exercise.type === "timeDistance") {
        const exerciseTemplateRes = await tx.insert(exerciseTemplate).values({
          userId: userId,
          workoutId: workoutTemplateId,
          exerciseId: exercise.exerciseId,
          notes: values.notes,
          orderNumber: index
        }).returning({ id: exerciseTemplate.id })

        const exerciseTemplateId = exerciseTemplateRes[0].id

        for (const [index, set] of exercise.sets.entries()) {
          const setTemplateRes = await tx.insert(setTemplate).values({
            exerciseTemplateId: exerciseTemplateId,
            orderNumber: index
          }).returning({ id: setTemplate.id })

          const setTemplateId = setTemplateRes[0].id

          const timeInMilliseconds = timeToMilliseconds[exercise.units.time](
            set.time
          )
          const distanceInMillimeters = distanceToMillimeters[exercise.units.distance](
            set.distance
          )

          await tx.insert(timeDistanceTemplate).values({
            setTemplateId: setTemplateId,
            time: Math.round(timeInMilliseconds),
            distance: Math.round(distanceInMillimeters)
          })
        }

      } else {
        throw new Error("Exercise of unknow type")
      }
    }
  })
}