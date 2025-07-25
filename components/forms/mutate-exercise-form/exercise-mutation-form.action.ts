"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseToExerciseTag, exerciseType, timeDistanceDefaultUnits, weightRepsDefaultUnits } from "@/db/schema"
import { auth } from "@/lib/auth"

import { ExerciseMutationFormSchema } from "./exercise-mutation-form.schema"

export const mutateExercise = async (values: ExerciseMutationFormSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const exerciseT = await db.select().from(exerciseType).where(eq(exerciseType.name, values.type))
  const typeId = exerciseT[0].id

  await db.transaction(async tx => {
    let exerciseId: string;

    if (values.id == undefined) {
      const exerciseReturned = await tx.insert(exercise).values({
        userId: userId,
        typeId: typeId,
        name: values.name,
        description: values.description
      }).returning({ id: exercise.id })

      exerciseId = exerciseReturned[0].id

    } else {
      const exerciseReturned = await tx.update(exercise).set({
        name: values.name,
        description: values.description
      }).where(eq(exercise.id, values.id)).returning({ id: exercise.id })

      exerciseId = exerciseReturned[0].id

      await tx.delete(exerciseToExerciseTag).where(
        eq(exerciseToExerciseTag.exerciseId, exerciseId)
      )
    }

    const exerciseToExerciseTagValues = values.tags.map(tag => ({
      exerciseId,
      exerciseTagId: tag
    }))

    if (exerciseToExerciseTagValues.length > 0) {
      await tx.insert(exerciseToExerciseTag).values(exerciseToExerciseTagValues)
    }

    if (values.type === "weightReps") {
      await tx
        .insert(weightRepsDefaultUnits)
        .values({
          exerciseId,
          weightUnit: values.weightUnit
        })
        .onConflictDoUpdate({
          target: weightRepsDefaultUnits.exerciseId,
          set: { weightUnit: values.weightUnit }
        })
    } else if (values.type === "timeDistance") {
      await tx
        .insert(timeDistanceDefaultUnits)
        .values({
          exerciseId,
          timeUnit: values.timeUnit,
          distanceUnit: values.distanceUnit
        })
        .onConflictDoUpdate({
          target: timeDistanceDefaultUnits.exerciseId,
          set: { 
            timeUnit: values.timeUnit,
            distanceUnit: values.distanceUnit
          }
        })
    }

  })
}