"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { program, programToProgramTag, programWorkout } from "@/db/schema"
import { auth } from "@/lib/auth"

import { programFormSchema } from "./program-form"

type ProgramFormSchema = z.infer<typeof programFormSchema>

export const buildProgram = async (values: ProgramFormSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  await db.transaction(async tx => {
    if (values.id) {
      await tx.delete(program).where(and(eq(program.id, values.id), eq(program.userId, userId)))
    }

    const newProgram = await tx.insert(program).values({
      userId: userId,
      name: values.name,
      descritpion: values.description
    }).returning({ id: program.id })

    const programId = newProgram[0].id

    if (values.tagIds.length > 0) {
      const programToTags = values.tagIds.map(programTagId => ({
        programId,
        programTagId
      }))

      await tx.insert(programToProgramTag).values(programToTags)
    }

    if (values.workouts.length > 0) {
      const programWorkouts = values.workouts.map(workout => ({
        programId,
        workoutId: workout.workoutId,
        day: workout.day
      }))

      await tx.insert(programWorkout).values(programWorkouts)
    }
  })
}