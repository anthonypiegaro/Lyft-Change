"use server"

import { ProgramForm } from "../program-form"
import { getProgramTags } from "../get-program-tags"
import { getWorkoutTags } from "../get-workout-tags"
import { getWorkouts } from "../get-workouts"

export default async function ProgramPage() {
  const [programTags, workoutTags, workouts] = await Promise.all([getProgramTags(), getWorkoutTags(), getWorkouts()])

  const defaultValues = {
    name: "",
    description: "",
    tagIds: [],
    workouts: []
  }

  return (
    <ProgramForm defaultValues={defaultValues} programTags={programTags} workoutTags={workoutTags} workouts={workouts} initWeeks={1}/>
  )
}