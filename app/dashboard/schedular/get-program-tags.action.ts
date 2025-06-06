"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { programTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { ProgramTag } from "./calendar/calendar"

export const getProgramTags = async (): Promise<ProgramTag[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const programTags = await db.select({ 
    id: programTag.id,
    name: programTag.name
  }).from(programTag).where(eq(programTag.userId, userId))

  return programTags
}