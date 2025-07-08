import * as z from "zod/v4"

export const createExerciseFormSchema = z.discriminatedUnion("type", [
  z.object({
    name: z.string().min(1),
    type: z.literal("weightReps"),
    description: z.string(),
    weightUnit: z.union([
      z.literal("g"),
      z.literal("kg"),
      z.literal("oz"),
      z.literal("lb")
    ]),
    tags: z.array(z.string())
  }),
  z.object({
    name: z.string().min(1),
    type: z.literal("timeDistance"),
    description: z.string(),
    timeUnit: z.union([
      z.literal("ms"),
      z.literal("s"),
      z.literal("m"),
      z.literal("h")
    ]),
    distanceUnit: z.union([
      z.literal("mm"),
      z.literal("m"),
      z.literal("km"),
      z.literal("in"),
      z.literal("ft"),
      z.literal("yd"),
      z.literal("mi")
    ]),
    tags: z.array(z.string())
  })
])

export type CreateExerciseFormSchema = z.infer<typeof createExerciseFormSchema>
