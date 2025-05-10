"use server"

import { z } from "zod"

import { workoutFormSchema } from "./workout-form.schema"

export const createWorkoutInstance = async (values: z.infer<typeof workoutFormSchema>) => {
  console.log(values)

  await new Promise(resolve => setTimeout(resolve, 5000))
}