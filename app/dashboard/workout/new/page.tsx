import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { exerciseTag } from "@/db/schema"
import { auth } from "@/lib/auth"

import { WorkoutForm } from "@/app/dashboard/workout/workout-form"

export default async function NewWorkoutPage() {
  const defaultValues = {
    name: "New Workout",
    date: new Date(),
    tagIds: [],
    notes: "",
    exercises: []
  }

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const tags = await db
    .select({ value: exerciseTag.id, label: exerciseTag.name })
    .from(exerciseTag)
    .where(eq(exerciseTag.userId, userId))

  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutForm workoutType="template" defaultValues={defaultValues} tagOptions={tags} />
    </div>
  )
}