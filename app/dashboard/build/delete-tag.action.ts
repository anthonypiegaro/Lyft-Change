"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exerciseTag, programTag, workoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteExerciseTag = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  await db.delete(exerciseTag).where(and(
    eq(exerciseTag.id, id),
    eq(exerciseTag.userId, userId)
  ))
}

export const deleteWorkoutTag = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  await db.delete(workoutTag).where(and(
    eq(workoutTag.id, id),
    eq(workoutTag.userId, userId)
  ))
}

export const deleteProgramTag = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  await db.delete(programTag).where(and(
    eq(programTag.id, id),
    eq(programTag.userId, userId)
  ))
}