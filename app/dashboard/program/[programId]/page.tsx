"use server"

import { ProgramForm } from "../program-form"
import { getProgramTags } from "../get-program-tags"
import { getWorkoutTags } from "../get-workout-tags"
import { getWorkouts } from "../get-workouts"
import { getProgram } from "./get-program"

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ programId: string }>
}) {
  const { programId } = await params

  const [
    programTags, 
    workoutTags, 
    workouts, 
    programData
  ] = await Promise.all([getProgramTags(), getWorkoutTags(), getWorkouts(), getProgram(programId)])

  const initWeeks = Math.floor(Math.max(...programData.workouts.map(workout => workout.day)) / 7) + 1

  return (
    <ProgramForm defaultValues={programData} programTags={programTags} workoutTags={workoutTags} workouts={workouts} initWeeks={initWeeks}/>
  )
}