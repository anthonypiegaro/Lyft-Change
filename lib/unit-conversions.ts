// weight conversions
export function gramsToOunces(g: number): number {
  return g / 28.349523125;
}

export function gramsToPounds(g: number): number {
  return g / 453.59237;
}

export function gramsToKilograms(g: number): number {
  return g / 1000;
}

// time conversions
export function msToSeconds(ms: number): number {
  return ms / 1000;
}

export function msToMinutes(ms: number): number {
  return ms / (1000 * 60);
}

export function msToHours(ms: number): number {
  return ms / (1000 * 60 * 60);
}

// Length conversions
export function mmToMeters(mm: number): number {
  return mm / 1000;
}

export function mmToKilometers(mm: number): number {
  return mm / 1_000_000;
}

export function mmToInches(mm: number): number {
  return mm / 25.4;
}

export function mmToFeet(mm: number): number {
  return mm / 304.8;
}

export function mmToYards(mm: number): number {
  return mm / 914.4;
}

export function mmToMiles(mm: number): number {
  return mm / 1_609_344;
}