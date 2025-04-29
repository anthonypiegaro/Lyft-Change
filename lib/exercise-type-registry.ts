import { z } from "zod"
import {
  DistanceInput,
  RepsInput,
  TimeInput,
  WeightInput
} from "@/components/workout-form/inputs"

import {
  ExerciseInput,
  ExerciseInputType,
  ExerciseType, 
  ExerciseTypeEntry 
} from "@/lib/types/exercise-type-registry.types"

//             !!!! WARNING !!!!

// A change in input units may cause the db to change.
//     Be sure changes do not cause a conflict.

const inputTypeRegistry: Record<ExerciseInputType, ExerciseInput> = {
  "distance": {
    name: "distance",
    zodObject: z.number().nonnegative().int(),
    units: ["mm", "m", "km", "in", "ft", "yd", "mi"],
    component: DistanceInput
  },
  "reps": {
    name: "reps",
    zodObject: z.number().nonnegative().int(),
    units: ["reps"],
    component: RepsInput
  },
  "time": {
    name: "time",
    zodObject: z.number().nonnegative().int(),
    units: ["ms", "s", "m", "h", "SS:mm", "MM:SS:mm", "HH:MM:SS:mm", "MM:SS", "HH:MM:SS"],
    component: TimeInput
  },
  "weight": {
    name: "weight",
    zodObject: z.number().nonnegative().int(),
    units: ["g", "kg", "oz", "lb"],
    component: WeightInput
  }
} as const


// any changes ere must be mirrored in lib/schemas/workout-form.ts
export const exerciseTypeRegistry: Record<ExerciseType, ExerciseTypeEntry> = {
  weightReps: {
    inputs: [
      inputTypeRegistry["weight"],
      inputTypeRegistry["reps"]
    ]
  },
  timeDistance: {
    inputs: [
      inputTypeRegistry["time"],
      inputTypeRegistry["distance"]
    ]
  }
} as const

export type ExerciseTypeRegistry = typeof exerciseTypeRegistry
