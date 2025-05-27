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

import { WorkoutTemplate } from "@/app/dashboard/schedular/calendar/calendar"

export const getWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const workoutTemplatesRes = await db
    .select({
      id: workout.id,
      name: workout.name,
      tagId: workoutTag.id,
      tagName: workoutTag.name
    })
    .from(workout)
    .leftJoin(workoutToWorkoutTag, eq(workout.id, workoutToWorkoutTag.workoutId))
    .leftJoin(workoutTag, eq(workoutToWorkoutTag.workoutTagId, workoutTag.id))
    .where(eq(workout.userId, userId))

  const workouts = workoutTemplatesRes.reduce((acc, workoutTemp) => {
    if (!(workoutTemp.id in acc)) {
      acc[workoutTemp.id] = {
        id: workoutTemp.id,
        name: workoutTemp.name,
        tags: []
      }
    }

    if (workoutTemp.tagId != null && workoutTemp.tagName != null) {
      acc[workoutTemp.id].tags.push({
        label: workoutTemp.tagName,
        value: workoutTemp.tagId
      })
    }

    return acc
  }, {} as Record<string, WorkoutTemplate>)

  return Object.values(workouts)
}
