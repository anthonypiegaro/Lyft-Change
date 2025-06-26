import { getExerciseData } from "./get-exercise-data"
import { TimeDistancePage } from "./time-distance-page"
import { WeightRepsPage } from "./weight-reps-page"

export type TimeDistanceExerciseData = {
  name: string
  type: "timeDistance"
  sets: {
    time: number,
    distance: number,
    date: string
  }[]
}

export type WeightRepsExerciseData = {
  name: string
  type: "weightReps"
  sets: {
    weight: number
    reps: number
    date: string
  }[]
}

function generateBeltSquatData(): WeightRepsExerciseData {
  const startDate = new Date("2023-06-01")
  const endDate = new Date("2025-06-24")
  const sets: { weight: number; reps: number; date: string }[] = []

  // Convert starting weight to grams (70 lbs ≈ 31,751 g)
  let weight = 31750
  let weekCount = 0

  // Progression parameters (convert to grams)
  const weightIncreaseInterval = 6 // weeks
  const weightIncreaseAmount = 1135 // 2.5 lbs ≈ 1,135 g
  const maxWeight = 81650 // 180 lbs ≈ 81,650 g

  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // 3 to 5 sets per workout
    const numSets = 3 + Math.floor(Math.random() * 3) // 3, 4, or 5

    // Simulate reps for each set (slight fatigue drop-off)
    let baseReps = 10 + Math.floor(Math.random() * 3) // 10-12 for first set
    for (let set = 0; set < numSets; set++) {
      // Each subsequent set may have 0-2 fewer reps
      const reps = Math.max(
        6,
        baseReps - set - Math.floor(Math.random() * 2)
      )
      sets.push({
        // Round to nearest 500g instead of 0.5 lbs
        weight: Math.round(weight / 500) * 500,
        reps,
        date: currentDate.toISOString().slice(0, 10),
      })
    }

    // Progress weight every 6 weeks, up to maxWeight
    weekCount++
    if (weekCount % weightIncreaseInterval === 0 && weight < maxWeight) {
      weight += weightIncreaseAmount
    }

    // Next week
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return {
    name: "Belt Squat",
    type: "weightReps",
    sets,
  }
}

function generateJogData(): TimeDistanceExerciseData {
  const startDate = new Date("2023-06-01")
  const endDate = new Date("2025-06-24")
  const sets: { time: number; distance: number; date: string }[] = []

  let time = 20 // minutes
  let distance = 2.5 // km
  let weekCount = 0

  // Progression parameters
  const timeIncreaseInterval = 8 // weeks
  const timeIncreaseAmount = 2 // minutes
  const maxTime = 70

  const distanceIncreaseInterval = 4 // weeks
  const distanceIncreaseAmount = 0.2 // km
  const maxDistance = 8.0

  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // Add some natural variation
    const timeVariation = Math.floor(Math.random() * 3) // 0-2 min
    const distanceVariation = Math.random() * 0.15 // 0-0.15 km

    sets.push({
      time: Math.min(
        maxTime,
        Math.round((time + timeVariation) * 10) / 10
      ),
      distance: Math.min(
        maxDistance,
        Math.round((distance + distanceVariation) * 100) / 100
      ),
      date: currentDate.toISOString().slice(0, 10),
    })

    // Progress time every 8 weeks, up to maxTime
    weekCount++
    if (weekCount % timeIncreaseInterval === 0 && time < maxTime) {
      time += timeIncreaseAmount
    }

    // Progress distance every 4 weeks, up to maxDistance
    if (weekCount % distanceIncreaseInterval === 0 && distance < maxDistance) {
      distance += distanceIncreaseAmount
    }

    // Next week
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return {
    name: "Jog",
    type: "timeDistance",
    sets,
  }
}

export type ExerciseData = TimeDistanceExerciseData | WeightRepsExerciseData

export default async function ExercisePage({
  params
}: {
  params: Promise<{ exerciseId: string }>
}) {
  const { exerciseId } = await params

  const data = await getExerciseData(exerciseId)

  if (!data) {
    return (
      <div>Exercise does not exist. It may have been deleted.</div>
    )
  }

  return data.type === "weightReps" ? <WeightRepsPage exerciseData={data} /> : <TimeDistancePage exerciseData={data} />
}