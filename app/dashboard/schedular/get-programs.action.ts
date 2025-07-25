"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { program, programTag, programToProgramTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { Program } from "./calendar/calendar"

export const getPrograms = async (): Promise<Program[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const programRes = await db.select({
      id: program.id,
      name: program.name,
      tagId: programTag.id,
      tagName: programTag.name
    })
    .from(program)
    .leftJoin(programToProgramTag, eq(program.id, programToProgramTag.programId))
    .leftJoin(programTag, eq(programToProgramTag.programTagId, programTag.id))
    .where(eq(program.userId, userId))

  const programs = programRes.reduce((acc, p) => {
    if (!(p.id in acc)) {
      acc[p.id] = {
        id: p.id,
        name: p.name,
        tags: []
      }
    }

    if (p.tagId && p.tagName) {
      acc[p.id].tags.push({
        id: p.tagId,
        name: p.tagName
      })
    }

    return acc
  }, {} as Record<string, Program>)

  return Object.values(programs)
}