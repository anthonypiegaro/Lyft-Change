"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exerciseTag } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getExerciseTags = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const exerciseTags = await db
    .select({
      id: exerciseTag.id,
      name: exerciseTag.name
    })
    .from(exerciseTag)
    .where(eq(exerciseTag.userId, userId))
  
  return exerciseTags
}