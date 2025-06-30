"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { exerciseTag } from "@/db/schema"
import { auth } from "@/lib/auth"
import { CreateExerciseTagFormSchema } from "./create-exercise-tag-form.schema"

export const createExerciseTag = async (values: CreateExerciseTagFormSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  try {
    const tag = await db.insert(exerciseTag).values({
      userId: userId,
      name: values.name
    }).returning({ id: exerciseTag.id })

    return { label: values.name, value: tag[0].id }
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error(`Tag with name ${values.name} already exists`)
    }

    throw error
  }
}