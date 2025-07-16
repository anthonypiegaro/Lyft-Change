"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { program, programTag, programToProgramTag } from "@/db/schema"
import { auth } from "@/lib/auth"
import { ProgramRowType } from "./columns"

export const getPrograms = async (): Promise<ProgramRowType[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const programs = await db.select({
      id: program.id,
      name: program.name,
      tagId: programTag.id,
      tagName: programTag.name
    })
    .from(program)
    .leftJoin(programToProgramTag, eq(program.id, programToProgramTag.programId))
    .leftJoin(programTag, eq(programToProgramTag.programTagId, programTag.id))
    .where(eq(program.userId, userId))

  const programsProcessed = programs.reduce((acc, p) => {
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
  }, {} as Record<string, ProgramRowType>)

  return Object.values(programsProcessed)
}
