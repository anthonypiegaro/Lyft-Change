"use server"

import { WorkoutForm } from "../../workout-form"
import { getExercises } from "../../get-exercises.action"
import { getExerciseTags } from "../../get-exercise-tags"
import { getWorkoutTags } from "../../get-workout-tags.action"

export default async function NewWorkoutTemplatePage() {
  const [exerciseTags, workoutTags, exercises] = await Promise.all([getExerciseTags(), getWorkoutTags(), getExercises()])

  const defaultValues = {
    name: "New Workout Template",
    date: new Date(),
    tagIds: [],
    notes: "",
    exercises: []
  }

  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutForm workoutType="template" defaultValues={defaultValues} initWorkoutTags={workoutTags} initExerciseTags={exerciseTags} initExercises={exercises}/>
    </div>
  )
}