"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, count, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { exerciseTag, workoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { tagFormSchema } from "./tag-form.schema"

export const createTag = async (values: z.infer<typeof tagFormSchema>) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id
  
  if (values.type === "exercise") {
    const tags = await db.select().from(exerciseTag).where(and(eq(exerciseTag.userId, userId), eq(exerciseTag.name, values.name)))

    if (tags.length > 0) {
      throw new Error(`Tag name "${values.name}" already exists`)
    }

    await db.insert(exerciseTag).values({
      name: values.name,
      userId: userId
    })

  } else if (values.type === "workout") {
    const tags = await db.select().from(workoutTag).where(and(eq(workoutTag.userId, userId), eq(workoutTag.name, values.name)))

    if (tags.length > 0) {
      throw new Error(`Tag name "${values.name}" already exists`)
    }

    await db.insert(workoutTag).values({
      name: values.name,
      userId: userId
    })

  } else if (values.type === "program") {
    console.log("Creating program")

  } else {
    throw new Error(`Tag type invalid: ${values.type}`)
  }
}