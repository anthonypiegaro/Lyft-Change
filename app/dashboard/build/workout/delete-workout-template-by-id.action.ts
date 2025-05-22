"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workout } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteWorkoutTemplateById = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("sign-in")
  }

  const userId = session.user.id

  await db.delete(workout).where(and(eq(workout.id, id), eq(workout.userId, userId)))
}