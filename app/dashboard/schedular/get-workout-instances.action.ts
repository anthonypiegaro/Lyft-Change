"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workoutInstance } from "@/db/schema"
import { auth } from "@/lib/auth"

import { WorkoutEventPreprocessed } from "./calendar-wrapper"

export const getWorkoutInstances = async (): Promise<WorkoutEventPreprocessed[]> => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/sign-in")
    }

    const userId = session.user.id

    const workoutInstances = await db.select({
        id: workoutInstance.id,
        name: workoutInstance.name,
        date: workoutInstance.date
    }).from(workoutInstance).where(eq(workoutInstance.userId, userId))

    return workoutInstances
}