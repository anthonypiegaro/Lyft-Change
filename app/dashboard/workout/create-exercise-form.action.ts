"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { 
  exercise, 
  exerciseToExerciseTag, 
  exerciseType, 
  timeDistanceDefaultUnits, 
  weightRepsDefaultUnits 
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateExerciseFormSchema } from "./create-exercise-form.schema"

export const createExercise = async (values: CreateExerciseFormSchema): Promise<{ id: string, typeId: string}> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const exerciseT = await db.select().from(exerciseType).where(eq(exerciseType.name, values.type))
  const typeId = exerciseT[0].id

  const newExerciseId: string = await db.transaction(async tx => {
    const exerciseReturned = await tx.insert(exercise).values({
      userId: userId,
      typeId: typeId,
      name: values.name,
      description: values.description
    }).returning({ id: exercise.id })

    const exerciseId = exerciseReturned[0].id

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
    } else if (values.type === "timeDistance") {
      await tx
        .insert(timeDistanceDefaultUnits)
        .values({
          exerciseId,
          timeUnit: values.timeUnit,
          distanceUnit: values.distanceUnit
        })
    }

    return exerciseId
  })

  return { id: newExerciseId, typeId: typeId }
}