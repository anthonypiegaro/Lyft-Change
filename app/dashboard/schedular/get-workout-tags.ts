"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"
import { Tag } from "@/app/dashboard/schedular/calendar/calendar"

export const getWorkoutTags = async (): Promise<Tag[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const workoutTags = await db
  .select({
    label: workoutTag.name,
    value: workoutTag.id
  })
  .from(workoutTag)
  .where(eq(workoutTag.userId, userId))
  .orderBy(workoutTag.name)

  return workoutTags
}
