"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseTag, exerciseToExerciseTag, exerciseType } from "@/db/schema"
import { auth } from "@/lib/auth"

import { ExerciseSelectExercise } from "./exercise-select"

export const getExercises = async (): Promise<ExerciseSelectExercise[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const exerciseRows = await db.select({
    id: exercise.id,
    name: exercise.name,
    typeId: exerciseType.id,
    type: exerciseType.name,
    tagId: exerciseTag.id,
    tag: exerciseTag.name
  })
  .from(exercise)
  .leftJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
  .leftJoin(exerciseToExerciseTag, eq(exercise.id, exerciseToExerciseTag.exerciseId))
  .leftJoin(exerciseTag, eq(exerciseToExerciseTag.exerciseTagId, exerciseTag.id))
  .where(and(eq(exercise.userId, userId), eq(exercise.hidden, false)))

  const exercises = exerciseRows.reduce((acc, row) => {
    if (!(row.id in acc)) {
      acc[row.id] = {
        id: row.id,
        name: row.name,
        type: {
            id: row.typeId,
            name: row.type
        },
        tags: []
      }
    }

    if (row.tag != null) {
      acc[row.id].tags.push({
        id: row.tagId as string,
        name: row.tag
      })
    }

    return acc
  }, {} as Record<string, any>)

  return Object.values(exercises)
}