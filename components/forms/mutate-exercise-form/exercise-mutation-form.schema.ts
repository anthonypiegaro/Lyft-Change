import { z } from "zod"

export const exerciseMutationFormSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["weightReps", "timeDistance"]),
  name: z.string().min(1),
  description: z.string()
})
