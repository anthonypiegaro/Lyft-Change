"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { program, programToProgramTag, programWorkout, workout } from "@/db/schema"
import { auth } from "@/lib/auth"

import { programFormSchema } from "../program-form"

export const getProgram = async (programId: string): Promise<z.infer<typeof programFormSchema>> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const [programData, tagIds, workouts] = await Promise.all([
    getProgramData(programId, userId),
    getTags(programId),
    getWorkouts(programId)
  ])

  if (programData.userId != userId) {
    redirect("/403")
  }

  return {
    id: programData.id,
    name: programData.name,
    description: programData.description ?? "",
    tagIds,
    workouts
  }
}

const getProgramData = async (programId: string, userId: string) => {
  const data = await db.select({
      id: program.id,
      name: program.name,
      description: program.descritpion,
      userId: program.userId
    })
    .from(program)
    .where(eq(program.id, programId))
  
  return data[0]
}

const getTags = async (programId: string) => {
  const tagData = await db.select({ 
      tagId: programToProgramTag.programTagId 
    })
    .from(programToProgramTag)
    .where(eq(programToProgramTag.programId, programId))

  return tagData.map(tag => tag.tagId)
}

const getWorkouts = async (programId: string) => {
  const workouts = await db.select({
      workoutId: workout.id,
      name: workout.name,
      day: programWorkout.day
    })
    .from(programWorkout)
    .innerJoin(workout, eq(programWorkout.workoutId, workout.id))
    .where(eq(programWorkout.programId, programId))

  return workouts
}