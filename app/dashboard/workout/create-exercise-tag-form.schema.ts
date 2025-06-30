import { z } from "zod"

export const createExerciseTagFormSchema = z.object({
  name: z.string().min(1, "name required")
})

export type CreateExerciseTagFormSchema = z.infer<typeof createExerciseTagFormSchema>
