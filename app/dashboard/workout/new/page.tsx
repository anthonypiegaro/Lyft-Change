"use server"

import { WorkoutForm } from "../workout-form"
import { getExercises } from "../get-exercises.action"
import { getTags } from "../get-tags.action"

export default async function NewWorkoutPage() {
  const [tags, exercises] = await Promise.all([getTags(), getExercises()])

  const defaultValues = {
    name: "New Workout",
    date: new Date(),
    tagIds: [],
    notes: "",
    exercises: []
  }

  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutForm workoutType="template" defaultValues={defaultValues} tagOptions={tags} exercises={exercises}/>
    </div>
  )
}