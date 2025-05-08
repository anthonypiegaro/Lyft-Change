import { z } from "zod"

export const tagFormSchema = z.object({
  name: z.string().min(1, "name required"),
  type: z.enum(["exercise", "workout", "program"])
})