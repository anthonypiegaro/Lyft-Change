import { getExerciseData } from "./get-exercise-data"

type TimeDistanceExerciseData = {
  name: string
  type: "timeDistance"
  sets: {
    time: number,
    distance: number,
    date: string
  }[]
}

type WeightRepsExerciseData = {
  name: string
  type: "weightReps"
  sets: {
    weight: number
    reps: number
    date: string
  }[]
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

  return (
    <>{exerciseId}</>
  )
}