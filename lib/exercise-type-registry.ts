import { z } from "zod"
import {
  DistanceInput,
  RepsInput,
  TimeInput,
  WeightInput
} from "@/components/workout-form/inputs"

import { ExerciseType, ExerciseTypeEntry } from "@/lib/types/exercise-type-registry.types"

//             !!!! WARNING !!!!

// A change in input units may cause the db to change.
//     Be sure changes do not cause a conflict.

export const exerciseTypeRegistry: Record<ExerciseType, ExerciseTypeEntry> = {
  weightReps: {
    inputs: [
      {
        name: "weight",
        zodObject: z.number().nonnegative().int(),
        units: ["g", "kg", "oz", "lb"],
        component: WeightInput
      },
      {
        name: "reps",
        zodObject: z.number().nonnegative().int(),
        units: ["reps"],
        component: RepsInput
      }
    ]
  },
  timeDistance: {
    inputs: [
      {
        name: "time",
        zodObject: z.number().nonnegative().int(),
        units: ["ms", "s", "m", "h", "SS:mm", "MM:SS:mm", "HH:MM:SS:mm", "MM:SS", "HH:MM:SS"],
        component: TimeInput
      },
      {
        name: "distance",
        zodObject: z.number().nonnegative().int(),
        units: ["mm", "m", "km", "in", "ft", "yd", "mi"],
        component: DistanceInput
      }
    ]
  }
}
