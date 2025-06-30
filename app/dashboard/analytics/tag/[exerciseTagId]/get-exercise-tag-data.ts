"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseInstance, exerciseTag, exerciseToExerciseTag, setInstance, workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getExerciseTagData = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const tagRes = await db.select({
    name: exerciseTag.name,
    userId: exerciseTag.userId
  })
  .from(exerciseTag)
  .where(eq(exerciseTag.id, id))

  if (tagRes.length === 0) {
    return
  }

  if (tagRes[0].userId !== userId) {
    redirect("/403")
  }

  const sets = await db
    .select({
      date: workoutInstance.date
    })
    .from(setInstance)
    .innerJoin(exerciseInstance, 
      eq(setInstance.exerciseInstanceId, exerciseInstance.id)
    )
    .innerJoin(exercise, 
      eq(exerciseInstance.exerciseId, exercise.id)
    )
    .innerJoin(exerciseToExerciseTag,
      eq(exercise.id, exerciseToExerciseTag.exerciseId)
    )
    .innerJoin(workoutInstance,
      eq(exerciseInstance.workoutInstanceId, workoutInstance.id)
    )
    .where(and(
      eq(exerciseToExerciseTag.exerciseTagId, id),
      eq(setInstance.completed, true)
    ))
  
  return ({
    name: tagRes[0].name,
    sets
  })
}