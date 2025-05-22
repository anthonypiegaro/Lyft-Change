"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { and, eq, sql } from "drizzle-orm"

import { db } from "@/db/db"
import { exerciseInstance, setInstance, timeDistanceInstance, weightRepsInstance, workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"

import { workoutFormSchema } from "./workout-form.schema"
import { PersonalRecord } from "./workout-form"
import { distanceToMillimeters, timeToMilliseconds, weightToGrams } from "./unit-converter"

type CreateWorkoutReturn = {
  personalRecords: PersonalRecord[]
}

export const createWorkoutInstance = async (values: z.infer<typeof workoutFormSchema>): Promise<CreateWorkoutReturn> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const personalRecords: string[] = []

  await db.transaction(async tx => {
    if (values.id != undefined) {
      await tx.delete(workoutInstance).where(eq(workoutInstance.id, values.id))
    }

    const workout = await tx.insert(workoutInstance).values({
      userId: userId,
      name: values.name,
      notes: values.notes,
      date: values.date.toISOString().slice(0, 10)
    }).returning({ workoutId: workoutInstance.id })

    const workoutId = workout[0].workoutId

    for (const [index, exercise] of values.exercises.entries()) {
      if (exercise.type === "weightReps") {
        const exerciseRes = await tx.insert(exerciseInstance).values({
          userId: userId,
          exerciseId: exercise.exerciseId,
          workoutInstanceId: workoutId,
          notes: exercise.notes,
          orderNumber: index
        }).returning({ id: exerciseInstance.id })

        const exerciseInstanceId = exerciseRes[0].id

        const maxWeightQuery = await tx
          .select({ maxWeight: sql`MAX(weight)` })
          .from(weightRepsInstance)
          .innerJoin(setInstance, eq(weightRepsInstance.setInstanceId, setInstance.id))
          .innerJoin(exerciseInstance, eq(setInstance.exerciseInstanceId, exerciseInstance.id))
          .where(and(
            eq(exerciseInstance.userId, userId),
            eq(exerciseInstance.exerciseId, exercise.exerciseId),
            eq(setInstance.completed, true)
          ))
          .execute()
        
        let maxWeight = maxWeightQuery[0].maxWeight !== null ? maxWeightQuery[0].maxWeight as number : 0
        let prIndex: number | null = null

        for (let setIndex = 0; setIndex < exercise.sets.length; setIndex++) {
          const set = exercise.sets[setIndex]

          const setInstanceRes = await tx.insert(setInstance).values({
            exerciseInstanceId: exerciseInstanceId,
            orderNumber: setIndex,
            completed: set.completed
          }).returning({ id: setInstance.id })

          const setInstanceId = setInstanceRes[0].id

          const weightInGrams = weightToGrams[exercise.units.weight](set.weight)

          await tx.insert(weightRepsInstance).values({
            setInstanceId: setInstanceId,
            weight: Math.round(weightInGrams),
            reps: Math.round(set.reps)
          })

          if (set.completed === true && weightInGrams > maxWeight) {
            prIndex = setIndex
            maxWeight = weightInGrams
          }
        }

        if (prIndex !== null) {
          personalRecords.push(
            `New Max ${exercise.name}: ${exercise.sets[prIndex].weight} ${exercise.units.weight}`
          )
        }

      } else if (exercise.type === "timeDistance") {
        const exerciseRes = await tx.insert(exerciseInstance).values({
          userId: userId,
          exerciseId: exercise.exerciseId,
          workoutInstanceId: workoutId,
          notes: exercise.notes,
          orderNumber: index
        }).returning({ id: exerciseInstance.id })

        const exerciseInstanceId = exerciseRes[0].id

        for (let setIndex = 0; setIndex < exercise.sets.length; setIndex++) {
          const set = exercise.sets[setIndex]

          const setInstanceRes = await tx.insert(setInstance).values({
            exerciseInstanceId: exerciseInstanceId,
            orderNumber: setIndex,
            completed: set.completed
          }).returning({ id: setInstance.id })

          const setInstanceId = setInstanceRes[0].id

          const timeInMilliseconds = timeToMilliseconds[exercise.units.time](set.time)
          const distanceInMillimeters = distanceToMillimeters[exercise.units.distance](set.distance)

          await tx.insert(timeDistanceInstance).values({
            setInstanceId: setInstanceId,
            time: Math.round(timeInMilliseconds),
            distance: Math.round(distanceInMillimeters)
          })
        }

      } else {
        throw new Error("Exercise of unknown type")
      }
    }
  })

  return {
    personalRecords
  }
}