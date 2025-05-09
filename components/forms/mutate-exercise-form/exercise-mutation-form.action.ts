"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { exercise, exerciseToExerciseTag, exerciseType } from "@/db/schema"
import { auth } from "@/lib/auth"

import { exerciseMutationFormSchema } from "./exercise-mutation-form.schema"

export const mutateExercise = async (values: z.infer<typeof exerciseMutationFormSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
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
        typeId: typeId,
        name: values.name,
        description: values.description
      }).returning({ id: exercise.id })

      exerciseId = exerciseReturned[0].id
    }

    await tx.delete(exerciseToExerciseTag).where(
      eq(exerciseToExerciseTag.exerciseId, exerciseId)
    )

    const exerciseToExerciseTagValues = values.tags.map(tag => ({
      exerciseId,
      exerciseTagId: tag
    }))

    await tx.insert(exerciseToExerciseTag).values(exerciseToExerciseTagValues)
  })
}