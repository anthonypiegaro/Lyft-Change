"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { workoutFormSchema } from "./workout-form.schema"

export const createWorkoutInstance = async (values: z.infer<typeof workoutFormSchema>) => {
  console.log(JSON.stringify(values, null, 2))

  await new Promise(resolve => setTimeout(resolve, 5000))

  
}