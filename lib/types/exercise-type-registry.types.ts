import React from "react";
import { ZodType } from "zod"

export const exerciseTypes = ["weightReps", "timeDistance"] as const;

export type ExerciseType = typeof exerciseTypes[number]

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
