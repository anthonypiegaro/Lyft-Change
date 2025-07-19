"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getWorkoutTags = async (): Promise<{ id: string, name: string }[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const tags = await db.select({ id: workoutTag.id, name: workoutTag.name }).from(workoutTag).where(eq(workoutTag.userId, userId)).orderBy(workoutTag.name)

  return tags
}