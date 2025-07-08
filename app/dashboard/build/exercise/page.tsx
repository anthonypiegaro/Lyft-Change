"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth";

import { columns } from "./columns"
import { DataTable } from "../data-table";

import { getExerciseTags } from "./get-exercise-tags.action";
import { getExercises } from "./get-exercises.action";

export default async function ExercisePage() {
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