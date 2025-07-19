"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db/db"
import { exercise } from "@/db/schema"

export const hideExerciseById = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }
  
  const userId = session.user.id

  await db.update(exercise).set({ hidden: true }).where(and(eq(exercise.id, id), eq(exercise.userId, userId)))
}