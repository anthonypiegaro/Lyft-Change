import { z } from "zod"

export const createProgramTagFormSchema = z.object({
  name: z.string().min(1, "name required")
})

export type CreateProgramTagFormSchema = z.infer<typeof createProgramTagFormSchema>
