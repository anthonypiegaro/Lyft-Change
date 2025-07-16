"use server"

import { columns } from "./columns"
import { DataTable } from "../data-table";

import { getExerciseTags } from "./get-exercise-tags.action";
import { getExercises } from "./get-exercises.action";

export default async function ExercisePage() {
  await new Promise(resolve => setTimeout(resolve, 5000))
  const [exerciseTags, exercises] = await Promise.all([getExerciseTags(), getExercises()])

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={exercises} 
        filterColumnName="name"
        type="exercise"
        tags={exerciseTags}
      />
    </div>
  )
}