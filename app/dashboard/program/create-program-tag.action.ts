"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { programTag } from "@/db/schema"
import { auth } from "@/lib/auth"
import { CreateProgramTagFormSchema } from "./create-program-tag-form.schema"

export const createProgramTag = async (values: CreateProgramTagFormSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  try {
    const tag = await db.insert(programTag).values({
      userId: userId,
      name: values.name
    }).returning({ id: programTag.id })

    return { name: values.name, id: tag[0].id }
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error(`Tag with name ${values.name} already exists`)
    }

    throw error
  }
}