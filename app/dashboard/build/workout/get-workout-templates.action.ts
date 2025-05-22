"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { 
  workout, 
  workoutTag, 
  workoutToWorkoutTag 
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { WorkoutRowType } from "./columns"

export const getWorkoutTemplates = async (): Promise<WorkoutRowType[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const workoutRows = await db.select({
    id: workout.id,
    name: workout.name,
    tagId: workoutTag.id,
    tagName: workoutTag.name
  })
  .from(workout)
  .leftJoin(workoutToWorkoutTag, eq(workout.id, workoutToWorkoutTag.workoutId))
  .leftJoin(workoutTag, eq(workoutToWorkoutTag.workoutTagId, workoutTag.id))
  .where(eq(workout.userId, userId))

  const workouts = workoutRows.reduce((acc, row) => {
    if (!(row.id in acc)) {
      acc[row.id] = {
        id: row.id,
        name: row.name,
        tags: []
      }
    }

    if (row.tagId != null) {
      acc[row.id].tags.push({
        id: row.tagId,
        name: row.tagName as string
      })
    }

    return acc
  }, {} as Record<string, WorkoutRowType>)

  return Object.values(workouts)
}
