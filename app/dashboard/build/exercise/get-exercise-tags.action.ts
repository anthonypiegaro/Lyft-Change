"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exerciseTag } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getExerciseTags = async (): Promise<{ id: string, name: string }[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const tags = await db.select({ id: exerciseTag.id, name: exerciseTag.name }).from(exerciseTag).where(eq(exerciseTag.userId, userId)).orderBy(exerciseTag.name)

  return tags;
}

export const getExerciseWithoutUserId = async () => {
  const session = await auth.api.getSession({
      headers: await headers()
    })
  
    if (!session) {
      redirect("/auth")
    }

    const userId = session.user.id

    const tags = await db.select({ id: exerciseTag.id, name: exerciseTag.name }).from(exerciseTag).where(eq(exerciseTag.userId, userId)).orderBy(exerciseTag.name)

    return tags;
}
