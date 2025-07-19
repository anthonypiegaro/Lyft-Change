"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exercise, exerciseInstance, setInstance, workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"
import { Workout } from "./day-plan"

export const getTodaysWorkouts = async (date: string): Promise<Workout[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/auth")
  }

  const userId = session.user.id

  const workoutDataRaw = await db
    .select({
      id: workoutInstance.id,
      name: workoutInstance.name,
      completed: workoutInstance.completed,
      exerciseName: exercise.name,
      exerciseOrder: exerciseInstance.orderNumber,
      setId: setInstance.id
    })
    .from(workoutInstance)
    .leftJoin(exerciseInstance, eq(exerciseInstance.workoutInstanceId, workoutInstance.id))
    .leftJoin(exercise, eq(exerciseInstance.exerciseId, exercise.id))
    .leftJoin(setInstance, eq(exerciseInstance.id, setInstance.exerciseInstanceId))
    .where(and(
      eq(workoutInstance.userId, userId),
      eq(workoutInstance.date, date)
    ))
  
  const workoutData = workoutDataRaw.reduce((acc, row) => {
    if (!(row.id in acc)) {
      acc[row.id] = {
        id: row.id,
        name: row.name,
        completed: row.completed,
        exercises: {}
      }
    }

    if (row.exerciseOrder !== null && !(row.exerciseOrder in acc[row.id].exercises)) {
      acc[row.id].exercises[row.exerciseOrder] = {
        orderNumber: row.exerciseOrder,
        name: row.exerciseName!,
        sets: 0
      }
    }

    if (row.exerciseOrder !== null && row.setId !== null) {
      acc[row.id].exercises[row.exerciseOrder].sets++
    }

    return acc
  }, {} as Record<string, {
    id: string,
    name: string,
    completed: boolean,
    exercises: Record<number, { name: string, sets: number, orderNumber: number }>
  }>)

  const processedData = Object.values(workoutData).map(workout => ({
    id: workout.id,
    name: workout.name,
    completed: workout.completed,
    exercises: Object
      .values(workout.exercises)
      .sort((a, b) => a.orderNumber - b.orderNumber)
      .map(exercise => ({ name: exercise.name, sets: exercise.sets }))
  }))

  return processedData
}