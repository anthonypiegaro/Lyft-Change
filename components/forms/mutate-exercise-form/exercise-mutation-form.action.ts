"use server"

import { z } from "zod"
import { exerciseMutationFormSchema } from "./exercise-mutation-form.schema"

export const mutateExercise = async (values: z.infer<typeof exerciseMutationFormSchema>) => {
  console.log("The action has received the values")

  console.log(values);
}