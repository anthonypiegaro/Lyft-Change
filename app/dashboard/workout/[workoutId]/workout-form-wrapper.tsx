"use client"

import { parseISO } from "date-fns"
import { z } from "zod"

import { WorkoutForm } from "../workout-form"
import { workoutFormSchema } from "../workout-form.schema"
import { ExerciseSelectExercise } from "../exercise-select"

export function WorkoutFormWrapper({
  exerciseTags,
  workoutTags,
  workoutType,
  defaultValues,
  exercises
}: {
  exerciseTags: { label: string, value: string }[]
  workoutTags: { label: string, value: string}[]
  workoutType: "instance" | "template"
  defaultValues: Omit<z.infer<typeof workoutFormSchema>, "date"> & { date: string }
  exercises: ExerciseSelectExercise[]
}) {
  const defaultValuesProcessed = {
    ...defaultValues,
    date: parseISO(defaultValues.date)
  }

  return <WorkoutForm workoutType={workoutType} defaultValues={defaultValuesProcessed} workoutTags={workoutTags} exerciseTags={exerciseTags} exercises={exercises}/>
}