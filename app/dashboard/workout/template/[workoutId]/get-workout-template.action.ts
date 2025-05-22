"use server"

import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { 
  exercise, 
  exerciseTemplate, 
  exerciseType,
  setTemplate,
  timeDistanceTemplate,
  weightRepsTemplate,
  workout,
  workoutToWorkoutTag 
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { workoutFormSchema } from "../../workout-form.schema"
import { distanceFromMillimeters, timeFromMilliseconds, weightFromGrams } from "../../unit-converter"

type WorkoutFormSchema = z.infer<typeof workoutFormSchema>

export const getWorkoutTemplate = async (id: string): Promise<WorkoutFormSchema> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const workoutTemplateRes = await db.select().from(workout).where(eq(workout.id, id))

  if (workoutTemplateRes.length === 0) {
    notFound()
  }

  if (workoutTemplateRes[0].userId !== userId) {
    redirect("/403")
  }

  const workoutId = workoutTemplateRes[0].id

  const tagIdsRes = await db.select({
    id: workoutToWorkoutTag.workoutTagId
  }).from(workoutToWorkoutTag).where(
    eq(workoutToWorkoutTag.workoutId, workoutId)
  )

  const workoutFormData: WorkoutFormSchema = {
    id: workoutId,
    name: workoutTemplateRes[0].name,
    notes: workoutTemplateRes[0].notes ?? "",
    date: new Date(),
    tagIds: tagIdsRes.map(tag => tag.id),
    exercises: []
  }

  const exercisesRes = await db.select({
    id: exerciseTemplate.id,
    exerciseId: exercise.id,
    name: exercise.name,
    type: exerciseType.name,
    notes: exerciseTemplate.notes
  })
  .from(exerciseTemplate)
  .innerJoin(exercise, eq(exerciseTemplate.exerciseId, exercise.id))
  .innerJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
  .where(eq(exerciseTemplate.workoutId, workoutId))
  .orderBy(exerciseTemplate.orderNumber)

  for (const exerciseRes of exercisesRes) {
      if (exerciseRes.type === "weightReps") {
        const setsRes = await db.select({
          weight: weightRepsTemplate.weight,
          reps: weightRepsTemplate.reps,
        })
        .from(setTemplate)
        .innerJoin(weightRepsTemplate, eq(setTemplate.id, weightRepsTemplate.setTemplateId))
        .where(eq(setTemplate.exerciseTemplateId, exerciseRes.id))
        .orderBy(setTemplate.orderNumber)
  
        workoutFormData.exercises.push({
          exerciseId: exerciseRes.exerciseId,
          name: exerciseRes.name,
          type: "weightReps",
          notes: exerciseRes.notes ?? "",
          units: {
            weight: "lb",
            reps: "reps"
          },
          sets: setsRes.map(set => ({
            weight: Math.round(weightFromGrams["lb"](set.weight)),
            reps: set.reps,
            completed: false
          }))
        })
      } else if (exerciseRes.type === "timeDistance") {
        const setsRes = await db.select({
          time: timeDistanceTemplate.time,
          distance: timeDistanceTemplate.distance,
        })
        .from(setTemplate)
        .innerJoin(timeDistanceTemplate, eq(setTemplate.id, timeDistanceTemplate.setTemplateId))
        .where(eq(setTemplate.exerciseTemplateId, exerciseRes.id))
        .orderBy(setTemplate.orderNumber)
  
        workoutFormData.exercises.push({
          exerciseId: exerciseRes.exerciseId,
          name: exerciseRes.name,
          type: "timeDistance",
          notes: exerciseRes.notes ?? "",
          units: {
            time: "m",
            distance: "mi"
          },
          sets: setsRes.map(set => ({
            time: Math.round(timeFromMilliseconds["m"](set.time)),
            distance: Math.round(distanceFromMillimeters["mi"](set.distance)),
            completed: false
          }))
        })
      }
    }

    return workoutFormData
}

