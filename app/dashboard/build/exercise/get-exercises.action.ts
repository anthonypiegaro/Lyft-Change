"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { 
  exercise, 
  exerciseTag, 
  exerciseToExerciseTag, 
  exerciseType,
  timeDistanceDefaultUnits,
  weightRepsDefaultUnits
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { ExerciseRowType } from "./columns"
import { error } from "console"

export const getExercises = async (): Promise<ExerciseRowType[]> => {
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
    type: exerciseType.name,
    tagId: exerciseTag.id,
    tag: exerciseTag.name,
    description: exercise.description,
    weightUnit: weightRepsDefaultUnits.weightUnit,
    timeUnit: timeDistanceDefaultUnits.timeUnit,
    distanceUnit: timeDistanceDefaultUnits.distanceUnit
  })
  .from(exercise)
  .leftJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
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
          type: "weightReps",
          weightUnit: row.weightUnit!,
          description: row?.description ?? "",
          tags: []
        }
      } else if (row.type === "timeDistance") {
        acc[row.id] = {
          id: row.id,
          name: row.name,
          type: "timeDistance",
          timeUnit: row.timeUnit!,
          distanceUnit: row.distanceUnit!,
          description: row?.description ?? "",
          tags: []
        }
      } else {
        throw new Error(`"${row.type}" does not exists`)
      }
    }

    if (row.tag != null) {
      acc[row.id].tags.push({
        id: row.tagId as string,
        name: row.tag
      })
    }

    return acc
  }, {} as Record<string, ExerciseRowType>)

  return Object.values(exercises)
}