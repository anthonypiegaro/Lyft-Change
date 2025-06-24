import { WeightRepsStatsInside } from "./weight-reps-stats-inside"

export async function WeightRepsStats({
  exerciseId
}: {
  exerciseId: string
}) {
  // use the exercise iD to grab the exercises data. This is where we would grab all its asscoiated data like its type etc.
  return (
    <WeightRepsStatsInside />
  )   
}