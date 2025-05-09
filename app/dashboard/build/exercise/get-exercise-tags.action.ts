"use server"

import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exerciseTag } from "@/db/schema"

export const getExerciseTags = async ({ userId }: { userId: string }): Promise<{ id: string, name: string }[]> => {
  const tags = await db.select({ id: exerciseTag.id, name: exerciseTag.name }).from(exerciseTag).where(eq(exerciseTag.userId, userId)).orderBy(exerciseTag.name)

  return tags;
}
