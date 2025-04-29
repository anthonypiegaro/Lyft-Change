import { AnyZodObject, z, ZodRawShape } from "zod"

import { ExerciseInput, ExerciseInputType, ExerciseType, exerciseTypes } from "../types/exercise-type-registry.types";
import { exerciseTypeRegistry } from "../exercise-type-registry"

function buildSetSchema(inputs: ExerciseInput[]): AnyZodObject {
  const shape: ZodRawShape = inputs.reduce((acc, input) => ({
    ...acc, [input.name]: input.zodObject
  }), {} as Record<ExerciseInputType, AnyZodObject>)

  return z.object(shape)
}

// Changes in exerciseTypeRegistry should be reflected here
// Could not find a TypeScript way of doing this dynamically
const exerciseSchemas = [
  z.object({
    name: z.string(),
    type: z.literal("weightReps"),
    notes: z.string(),
    sets: z.array(buildSetSchema(exerciseTypeRegistry["weightReps"].inputs))
  }),
  z.object({
    name: z.string(),
    type: z.literal("timeDistance"),
    notes: z.string(),
    sets: z.array(buildSetSchema(exerciseTypeRegistry["timeDistance"].inputs))
  })
] as const

const exerciseSchema = z.discriminatedUnion("type", exerciseSchemas)

export const workoutFormSchema = z.object({
  name: z
      .string()
      .min(1, "Workout name required")
      .max(1000, "Workout name too long"),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date type"
  }),
  notes: z.string(),
  exercises: z.array(exerciseSchema)
})
