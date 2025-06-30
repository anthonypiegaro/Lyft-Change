"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { workoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"
import { CreateWorkoutTagFormSchema } from "./create-workout-tag-form.schema"

export const createWorkoutTag = async (values: CreateWorkoutTagFormSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  try {
    const tag = await db.insert(workoutTag).values({
      userId: userId,
      name: values.name
    }).returning({ id: workoutTag.id })

    return { label: values.name, value: tag[0].id }
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error(`Tag with name ${values.name} already exists`)
    }

    throw error
  }
}