"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteWorkout = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  await db.delete(workoutInstance).where(and(eq(workoutInstance.id, id), eq(workoutInstance.userId, userId)))
} 