import { z } from "zod"

import { 
  DistanceUnits,
  TimeUnits,
  WeightUnits
} from "./workout-form.schema";

// Distance: to millimeters
export const distanceToMillimeters: Record<DistanceUnits, (v: number) => number> = {
  mm: (v: number) => v,
  m: (v: number) => v * 1000,
  km: (v: number) => v * 1_000_000,
  in: (v: number) => v * 25.4,
  ft: (v: number) => v * 304.8,
  yd: (v: number) => v * 914.4,
  mi: (v: number) => v * 1_609_344,
} as const;

export const distanceFromMillimeters: Record<
  DistanceUnits,
  (v: number) => number
> = {
  mm: (v: number) => v,
  m: (v: number) => v / 1000,
  km: (v: number) => v / 1_000_000,
  in: (v: number) => v / 25.4,
  ft: (v: number) => v / 304.8,
  yd: (v: number) => v / 914.4,
  mi: (v: number) => v / 1_609_344,
} as const;

// Time: to milliseconds
export const timeToMilliseconds: Record<TimeUnits, (v: number) => number> = {
  ms: (v: number) => v,
  s: (v: number) => v * 1000,
  m: (v: number) => v * 60_000,
  h: (v: number) => v * 3_600_000,
} as const;

export const timeFromMilliseconds: Record<
  TimeUnits,
  (v: number) => number
> = {
  ms: (v: number) => v,
  s: (v: number) => v / 1000,
  m: (v: number) => v / 60_000,
  h: (v: number) => v / 3_600_000,
} as const;

// Weight: to grams
export const weightToGrams: Record<WeightUnits, (v: number) => number> = {
  g: (v: number) => v,
  kg: (v: number) => v * 1000,
  oz: (v: number) => v * 28.3495,
  lb: (v: number) => v * 453.592,
} as const;

export const weightFromGrams: Record<
  WeightUnits,
  (v: number) => number
> = {
  g: (v: number) => v,
  kg: (v: number) => v / 1000,
  oz: (v: number) => v / 28.3495,
  lb: (v: number) => v / 453.592,
} as const;