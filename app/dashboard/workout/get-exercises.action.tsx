"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseTag, exerciseToExerciseTag, exerciseType, timeDistanceDefaultUnits, weightRepsDefaultUnits } from "@/db/schema"
import { auth } from "@/lib/auth"

import { ExerciseSelectExercise } from "./exercise-select"

export const getExercises = async (): Promise<ExerciseSelectExercise[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const exerciseRows = await db.select({
    id: exercise.id,
    name: exercise.name,
    typeId: exerciseType.id,
    type: exerciseType.name,
    tagId: exerciseTag.id,
    tag: exerciseTag.name,
    weightUnit: weightRepsDefaultUnits.weightUnit,
    timeUnit: timeDistanceDefaultUnits.timeUnit,
    distanceUnit: timeDistanceDefaultUnits.distanceUnit
  })
  .from(exercise)
  .innerJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
  .leftJoin(exerciseToExerciseTag, eq(exercise.id, exerciseToExerciseTag.exerciseId))
  .leftJoin(exerciseTag, eq(exerciseToExerciseTag.exerciseTagId, exerciseTag.id))
  .leftJoin(weightRepsDefaultUnits, eq(exercise.id, weightRepsDefaultUnits.exerciseId))
  .leftJoin(timeDistanceDefaultUnits, eq(exercise.id, timeDistanceDefaultUnits.exerciseId))
  .where(and(eq(exercise.userId, userId), eq(exercise.hidden, false)))

  const exercises = exerciseRows.reduce((acc, row) => {
    if (!(row.id in acc)) {
      if (row.type === "weightReps") {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          typeId: row.typeId,
          typeName: row.type,
          tags: [],
          weightUnit: row.weightUnit!
        }
      } else if (row.type === "timeDistance") {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          typeId: row.typeId,
          typeName: row.type,
          tags: [],
          timeUnit: row.timeUnit!,
          distanceUnit: row.distanceUnit!
        }
      }
    }

    if (row.tag != null) {
      acc[row.id].tags.push({
        id: row.tagId as string,
        name: row.tag
      })
    }

    return acc
  }, {} as Record<string, ExerciseSelectExercise>)

  return Object.values(exercises)
}