"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db/db"
import { exerciseTag } from "@/db/schema"

export const getExerciseTags = async (): Promise<{ name: string }[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const tags = await db.select({ name: exerciseTag.name }).from(exerciseTag).where(eq(exerciseTag.userId, userId))

  return tags;
}
