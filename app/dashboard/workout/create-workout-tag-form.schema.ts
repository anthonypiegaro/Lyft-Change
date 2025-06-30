import { z } from "zod"

export const createWorkoutTagFormSchema = z.object({
  name: z.string().min(1, "name required")
})

export type CreateWorkoutTagFormSchema = z.infer<typeof createWorkoutTagFormSchema>
