import * as z from "zod/v4"

const distanceValidation = z.number().nonnegative()
export const distanceUnits = z.enum(["mm", "m", "km", "in", "ft", "yd", "mi"])

const repsValidation = z.number().nonnegative().int()
export const repsUnits = z.enum(["reps"])

const timeValidation = z.number().nonnegative()
export const timeUnits = z.enum(["ms", "s", "m", "h"])

const weightValidation = z.number().nonnegative()
export const weightUnits = z.enum(["g", "kg", "oz", "lb"])

const exerciseSchemas = [
  z.object({
    exerciseId: z.string(),
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
  }).check(ctx => {
    if (ctx.value.units.weight === "g") {
      ctx.value.sets.forEach((set, index) => {
        if (!Number.isInteger(set.weight)) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.sets[index],
            path: ["sets", index, "weight"]
          })
        }
      })
    }
  }),
  z.object({
    exerciseId: z.string(),
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
  }).check(ctx => {
    if (ctx.value.units.time === "ms") {
      ctx.value.sets.forEach((set, index) => {
        if (!Number.isInteger(set.time)) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.sets[index],
            path: ["sets", index, "time"]
          })
        }
      })
    }

    if (ctx.value.units.distance === "mm") {
      ctx.value.sets.forEach((set, index) => {
        if (!Number.isInteger(set.distance)) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.sets[index],
            path: ["sets", index, "distance"]
          })
        }
      })
    }
  })
] as const

const exerciseSchema = z.discriminatedUnion("type", exerciseSchemas)

export const workoutFormSchema = z.object({
  id: z.string().optional(),
  name: z
      .string()
      .min(1, "Workout name required")
      .max(1000, "Workout name too long"),
  date: z.date({
    error: issue => issue.input === undefined ? "Required" : "Invalid date"
  }),
  tagIds: z.array(z.string()),
  notes: z.string(),
  exercises: z.array(exerciseSchema)
})

export type WorkoutFormSchema = z.infer<typeof workoutFormSchema>
