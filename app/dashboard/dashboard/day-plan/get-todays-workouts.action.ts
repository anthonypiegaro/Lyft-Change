"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseInstance, setInstance, workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"
import { Workout } from "./day-plan"

export const getTodaysWorkouts = async (): Promise<Workout[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const today = new Date().toISOString().slice(0, 10);

  const workoutDataRaw = await db
    .select({
      id: workoutInstance.id,
      name: workoutInstance.name,
      exerciseName: exercise.name,
      exerciseOrder: exerciseInstance.orderNumber,
      setId: setInstance.id
    })
    .from(workoutInstance)
    .innerJoin(exerciseInstance, eq(exerciseInstance.workoutInstanceId, workoutInstance.id))
    .innerJoin(exercise, eq(exerciseInstance.exerciseId, exercise.id))
    .innerJoin(setInstance, eq(exerciseInstance.id, setInstance.exerciseInstanceId))
    .where(and(
      eq(workoutInstance.userId, userId),
      eq(workoutInstance.date, today)
    ))
  
  const workoutData = workoutDataRaw.reduce((acc, row) => {
    if (!(row.id in acc)) {
      acc[row.id] = {
        id: row.id,
        name: row.name,
        exercises: {}
      }
    }

    if (!(row.exerciseOrder in acc[row.id].exercises)) {
      acc[row.id].exercises[row.exerciseOrder] = {
        orderNumber: row.exerciseOrder,
        name: row.exerciseName,
        sets: 0
      }
    }

    acc[row.id].exercises[row.exerciseOrder].sets++

    return acc
  }, {} as Record<string, {
    id: string,
    name: string,
    exercises: Record<number, { name: string, sets: number, orderNumber: number }>
  }>)

  const processedData = Object.values(workoutData).map(workout => ({
    id: workout.id,
    name: workout.name,
    exercises: Object
      .values(workout.exercises)
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map(exercise => ({ name: exercise.name, sets: exercise.sets }))
  }))

  return processedData
}