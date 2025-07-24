"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { 
  exercise, 
  exerciseInstance, 
  exerciseType, 
  setInstance,
  timeDistanceInstance,
  weightRepsInstance, 
  workoutInstance 
} from "@/db/schema"
import { auth } from "@/lib/auth"
import { ExerciseData } from "./page"

export const getExerciseData = async (id: string): Promise<ExerciseData | void> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const exerciseRes = await db
    .select({
      name: exercise.name,
      type: exerciseType.name,
      userId: exercise.userId
    })
    .from(exercise)
    .innerJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
    .where(eq(exercise.id, id))

  if (exerciseRes.length === 0) {
    return
  }

  if (exerciseRes[0].userId !== userId) {
    redirect("/403")
  }

  const exerciseData: ExerciseData = {
    name: exerciseRes[0].name,
    type: exerciseRes[0].type as ExerciseData["type"],
    sets: []
  }

  if (exerciseData.type === "weightReps") {
    const sets = await db
      .select({
        weight: weightRepsInstance.weight,
        reps: weightRepsInstance.reps,
        date: workoutInstance.date
      })
      .from(weightRepsInstance)
      .innerJoin(setInstance, eq(weightRepsInstance.setInstanceId, setInstance.id))
      .innerJoin(exerciseInstance, eq(setInstance.exerciseInstanceId, exerciseInstance.id))
      .innerJoin(workoutInstance, eq(exerciseInstance.workoutInstanceId, workoutInstance.id))
      .where(and(
        eq(exerciseInstance.exerciseId, id),
        eq(setInstance.completed, true)
      ))
    
    exerciseData.sets = sets
  } else {
    const sets = await db
      .select({
        time: timeDistanceInstance.time,
        distance: timeDistanceInstance.distance,
        date: workoutInstance.date
      })
      .from(timeDistanceInstance)
      .innerJoin(setInstance, eq(timeDistanceInstance.setInstanceId, setInstance.id))
      .innerJoin(exerciseInstance, eq(setInstance.exerciseInstanceId, exerciseInstance.id))
      .innerJoin(workoutInstance, eq(exerciseInstance.workoutInstanceId, workoutInstance.id))
      .where(and(
        eq(exerciseInstance.exerciseId, id),
        eq(setInstance.completed, true)
      ))
    
    exerciseData.sets = sets
  }

  return exerciseData
}