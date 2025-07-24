import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"

import { Workout } from "./columns"

export const getWorkouts = async (): Promise<Workout[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const workouts = await db
    .select({
      id: workoutInstance.id,
      name: workoutInstance.name,
      description: workoutInstance.notes,
      date: workoutInstance.date
    })
    .from(workoutInstance)
    .where(and(
      eq(workoutInstance.userId, userId),
      eq(workoutInstance.completed, true)
    ))
  
  
  return workouts.map(workout => ({ ...workout, description: workout.description ?? ""}))
}