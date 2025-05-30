"use server"

import { ProgramForm } from "../program-form"
import { getProgramTags } from "../get-program-tags"
import { getWorkoutTags } from "../get-workout-tags"

export default async function ProgramPage() {
  const [programTags, workoutTags] = await Promise.all([getProgramTags(), getWorkoutTags()])

  const defaultValues = {
    name: "",
    description: "",
    tagIds: [],
    workouts: []
  }

  return (
    <ProgramForm defaultValues={defaultValues} programTags={programTags} workoutTags={workoutTags}/>
  )
}