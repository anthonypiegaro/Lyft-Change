"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { program } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteProgram = async (programId: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  await db.delete(program).where(and(
    eq(program.id, programId),
    eq(program.userId, userId)
  ))
}