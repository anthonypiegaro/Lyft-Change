"use server"

import { WorkoutForm } from "../../workout-form"
import { getExercises } from "../../get-exercises.action"
import { getExerciseTags } from "../../get-exercise-tags"
import { getWorkoutTags } from "../../get-workout-tags.action"
import { getWorkoutTemplate } from "./get-workout-template.action"

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { workoutId } = await params

  const [exerciseTags, workoutTags, exercises, defaultValues] = await Promise.all([
    getExerciseTags(), getWorkoutTags(), getExercises(), getWorkoutTemplate(workoutId)
  ])

  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutForm workoutType="template" defaultValues={defaultValues} workoutTags={workoutTags} exerciseTags={exerciseTags} initExercises={exercises}/>
    </div>
  )
}