import React from "react";
import { ZodType } from "zod"

export type ExerciseType = "weightReps" | "timeDistance"

export type ExerciseInputType = "distance" | "reps" | "time" | "weight"

export interface ExerciseInput {
  name: ExerciseInputType
  zodObject: ZodType
  units: string[]
  component: React.FC
}

export interface ExerciseTypeEntry {
  inputs: ExerciseInput[]
}
