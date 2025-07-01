"use client"

import { parseISO } from "date-fns"

import { WorkoutForm } from "../workout-form"
import { WorkoutFormSchema } from "../workout-form.schema"
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
  defaultValues: Omit<WorkoutFormSchema, "date"> & { date: string }
  exercises: ExerciseSelectExercise[]
}) {
  const defaultValuesProcessed = {
    ...defaultValues,
    date: parseISO(defaultValues.date)
  }

  return <WorkoutForm workoutType={workoutType} defaultValues={defaultValuesProcessed} initWorkoutTags={workoutTags} initExerciseTags={exerciseTags} initExercises={exercises}/>
}