"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getWorkoutTags = async (): Promise<{ name: string }[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const tags = await db.select({ name: workoutTag.name }).from(workoutTag).where(eq(workoutTag.userId, userId))

  return tags
}