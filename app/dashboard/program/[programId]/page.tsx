"use server"

import { ProgramForm } from "../program-form"
import { getProgramTags } from "../get-program-tags"
import { getWorkoutTags } from "../get-workout-tags"

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ programId: string }>
}) {
  const { programId } = await params

  const [programTags, workoutTags] = await Promise.all([getProgramTags(), getWorkoutTags()])

  // get program from the db
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