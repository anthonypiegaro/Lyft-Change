"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workout, workoutTag, workoutToWorkoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { WorkoutItem } from "./program-form"

export const getWorkouts = async (): Promise<WorkoutItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const workouts = await db.select({
      id: workout.id,
      name: workout.name,
      tagId: workoutTag.id,
      tagName: workoutTag.name
    })
    .from(workout)
    .leftJoin(workoutToWorkoutTag, eq(workout.id, workoutToWorkoutTag.workoutId))
    .leftJoin(workoutTag, eq(workoutToWorkoutTag.workoutTagId, workoutTag.id))
    .where(eq(workout.userId, userId))

  const workoutsProcessed = workouts.reduce((acc, w) => {
    if (!(w.id in acc)) {
      acc[w.id] = {
        workoutId: w.id,
        name: w.name,
        tags: []
      }
    }

    if (w.tagId != null && w.tagName != null) {
      acc[w.id].tags.push({ id: w.tagId, name: w.tagName })
    }

    return acc
  }, {} as Record<string, WorkoutItem>)

  return Object.values(workoutsProcessed)
}