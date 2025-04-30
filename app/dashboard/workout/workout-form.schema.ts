import { z } from "zod"

const distanceValidation = z.number().nonnegative().int()
export const distanceUnits = z.enum(["mm", "m", "km", "in", "ft", "yd", "mi"])

const repsValidation = z.number().nonnegative().int()
export const repsUnits = z.enum(["reps"])

const timeValidation = z.number().nonnegative().int()
export const timeUnits = z.enum(["ms", "s", "m", "h", "SS:mm", "MM:SS:mm", "HH:MM:SS:mm", "MM:SS", "HH:MM:SS"])

const weightValidation = z.number().nonnegative().int()
export const weightUnits = z.enum(["g", "kg", "oz", "lb"])

const exerciseSchemas = [
  z.object({
    name: z.string(),
    type: z.literal("weightReps"),
    notes: z.string(),
    units: z.object({
      weight: weightUnits,
      reps: repsUnits
    }),
    sets: z.array(z.object({
      weight: weightValidation,
      reps: repsValidation,
      completed: z.boolean()
    }))
  }),
  z.object({
    name: z.string(),
    type: z.literal("timeDistance"),
    notes: z.string(),
    units: z.object({
      time: timeUnits,
      distance: distanceUnits
    }),
    sets: z.array(z.object({
      time: timeValidation,
      distance: distanceValidation,
      completed: z.boolean()
    }))
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
