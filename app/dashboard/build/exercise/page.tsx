"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth";

import { columns } from "./columns"
import { DataTable } from "../data-table";

import { getExerciseTags } from "./get-exercise-tags.action";
import { getExercises } from "./get-exercises.action";

export default async function ExercisePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const [exerciseTags, exercises] = await Promise.all([getExerciseTags({ userId }), getExercises({ userId })])

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