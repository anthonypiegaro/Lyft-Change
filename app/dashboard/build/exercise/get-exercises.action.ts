"use server"

import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseTag, exerciseToExerciseTag, exerciseType } from "@/db/schema"
import { ExerciseRowType } from "./columns"

export const getExercises = async ({ userId }: { userId: string }): Promise<ExerciseRowType[]> => {
  const exerciseRows = await db.select({
    id: exercise.id,
    name: exercise.name,
    type: exerciseType.name,
    tag: exerciseTag.name
  })
  .from(exercise)
  .leftJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
  .leftJoin(exerciseToExerciseTag, eq(exercise.id, exerciseToExerciseTag.exerciseId))
  .leftJoin(exerciseTag, eq(exerciseToExerciseTag.exerciseTagId, exerciseTag.id))
  .where(eq(exercise.userId, userId))

  const exercises = exerciseRows.reduce((acc, row) => {
    if (!(row.id in acc)) {
      acc[row.id] = {
        id: row.id,
        name: row.name,
        type: row.type as ExerciseRowType["type"],
        tags: []
      }
    }

    if (row.tag != null) {
      acc[row.id].tags.push(row.tag)
    }

    return acc
  }, {} as Record<string, ExerciseRowType>)

  return Object.values(exercises)
}