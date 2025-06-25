"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getExerciseData = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const exerciseCheck = await db.select({ userId: exercise.userId }).from(exercise).where(eq(exercise.id, id))

  if (exerciseCheck.length === 0) {
    // no exercise found. Return with a message or some sort of page / error
  }

  if (exerciseCheck[0].userId) {
    // send to forbidden (403??)
  }
}