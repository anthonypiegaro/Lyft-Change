"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseType } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getExercises = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const exercises = await db
    .select({
      id: exercise.id,
      name: exercise.name,
      type: exerciseType.name
    })
    .from(exercise)
    .innerJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
    .where(and(
      eq(exercise.userId, userId),
      eq(exercise.hidden, false)
    ))
  
  return exercises
}