"use server"

import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { eq } from "drizzle-orm"

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

import { WorkoutFormSchema } from "../workout-form.schema"
import { distanceFromMillimeters, timeFromMilliseconds, weightFromGrams } from "../unit-converter"

export const getWorkout = async (id: string): Promise<Omit<WorkoutFormSchema, "date"> & { date: string }> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const workoutRes = await db.select({
    userId: workoutInstance.userId,
    name: workoutInstance.name,
    date: workoutInstance.date,
    notes: workoutInstance.notes
  }).from(workoutInstance).where(eq(workoutInstance.id, id))

  const workout: Omit<WorkoutFormSchema, "date"> & { date: string } = { 
    name: workoutRes[0].name,
    notes: workoutRes[0].notes ?? "",
    date: workoutRes[0].date,
    id, 
    tagIds: [], 
    exercises: [] 
  }

  if (workoutRes.length === 0) {
    notFound()
  }

  if (workoutRes[0].userId !== userId) {
    redirect("/403")
  }

  const exercisesRes = await db.select({
    id: exerciseInstance.id,
    exerciseId: exerciseInstance.exerciseId,
    name: exercise.name,
    type: exerciseType.name,
    notes: exerciseInstance.notes
  })
  .from(exerciseInstance)
  .innerJoin(exercise, eq(exerciseInstance.exerciseId, exercise.id))
  .innerJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
  .where(eq(exerciseInstance.workoutInstanceId, id))
  .orderBy(exerciseInstance.orderNumber)

  for (const exerciseRes of exercisesRes) {
    if (exerciseRes.type === "weightReps") {
      const setsRes = await db.select({
        weight: weightRepsInstance.weight,
        reps: weightRepsInstance.reps,
        completed: setInstance.completed
      })
      .from(setInstance)
      .innerJoin(weightRepsInstance, eq(setInstance.id, weightRepsInstance.setInstanceId))
      .where(eq(setInstance.exerciseInstanceId, exerciseRes.id))
      .orderBy(setInstance.orderNumber)

      workout.exercises.push({
        exerciseId: exerciseRes.exerciseId,
        name: exerciseRes.name,
        type: "weightReps",
        notes: exerciseRes.notes ?? "",
        units: {
          weight: "lb",
          reps: "reps"
        },
        sets: setsRes.map(set => ({
          weight: Math.round(weightFromGrams["lb"](set.weight) * 100) / 100,
          reps: set.reps,
          completed: set.completed
        }))
      })
    } else if (exerciseRes.type === "timeDistance") {
      const setsRes = await db.select({
        time: timeDistanceInstance.time,
        distance: timeDistanceInstance.distance,
        completed: setInstance.completed
      })
      .from(setInstance)
      .innerJoin(timeDistanceInstance, eq(setInstance.id, timeDistanceInstance.setInstanceId))
      .where(eq(setInstance.exerciseInstanceId, exerciseRes.id))
      .orderBy(setInstance.orderNumber)

      workout.exercises.push({
        exerciseId: exerciseRes.exerciseId,
        name: exerciseRes.name,
        type: "timeDistance",
        notes: exerciseRes.notes ?? "",
        units: {
          time: "m",
          distance: "mi"
        },
        sets: setsRes.map(set => ({
          time: Math.round(timeFromMilliseconds["m"](set.time) * 100) / 100,
          distance: Math.round(distanceFromMillimeters["mi"](set.distance) * 100) / 100,
          completed: set.completed
        }))
      })
    }
  }

  return workout
}
