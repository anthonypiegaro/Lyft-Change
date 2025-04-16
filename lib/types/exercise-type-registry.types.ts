import React from "react";
import { ZodType } from "zod"

export type ExerciseType = "weightReps" | "timeDistance";

interface ExerciseInput {
  name: String;
  zodObject: ZodType;
  units: String[];
  component: React.FC;
}

export interface ExerciseTypeEntry {
  inputs: ExerciseInput[];
}
