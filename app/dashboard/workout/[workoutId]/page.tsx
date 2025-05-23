"use server"

import { WorkoutFormWrapper } from "./workout-form-wrapper"
import { getExercises } from "../get-exercises.action"
import { getExerciseTags } from "../get-exercise-tags"
import { getWorkoutTags } from "../get-workout-tags.action"
import { getWorkout } from "./get-workout.action"

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { workoutId } = await params

  const [exerciseTags, workoutTags, exercises, defaultValuesPre] = await Promise.all([
    getExerciseTags(), getWorkoutTags(), getExercises(), getWorkout(workoutId)
  ])

  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutFormWrapper workoutType="instance" defaultValues={defaultValuesPre} workoutTags={workoutTags} exerciseTags={exerciseTags} exercises={exercises}/>
    </div>
  )
}