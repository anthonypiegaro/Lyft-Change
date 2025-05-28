import { z } from "zod"

export const createExerciseFormSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["weightReps", "timeDistance"]),
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string())
})