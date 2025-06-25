import { Card } from "@/components/ui/card"

import { ExerciseSelect, Exercise } from "./exercise-select"
import { Stats } from "./stats/stats"

const exercises: Exercise[] = [
  { name: "Belt Squat", id: "b7d821098f", type: "weightReps" },
  { name: "Bench Press", id: "121fe1", type: "weightReps" },
  { name: "Bicep Curl", id: "3ngjehgdsn", type: "weightReps" },
  { name: "Calf Raise", id: "c4lfr4153", type: "weightReps" },
  { name: "Chest Fly", id: "ch35tfly", type: "weightReps" },
  { name: "Deadlift", id: "liasdunf9o8aduf", type: "weightReps" },
  { name: "Face Pull", id: "f4c3pull", type: "weightReps" },
  { name: "Farmer's Walk", id: "f4rm3r5w4lk", type: "timeDistance" },
  { name: "Hammer Curl", id: "h4mm3rcurl", type: "weightReps" },
  { name: "Hip Thrust", id: "h1pthru57", type: "weightReps" },
  { name: "Incline Bench", id: "1ncl1n3b3nch", type: "weightReps" },
  { name: "Lat Pulldown", id: "l4tpulld0wn", type: "weightReps" },
  { name: "Leg Curl", id: "l3gcurl", type: "weightReps" },
  { name: "Leg Extension", id: "l3g3xt3ns10n", type: "weightReps" },
  { name: "Leg Press", id: "l3gpr355", type: "weightReps" },
  { name: "Overhead Press", id: "o9u8y7t6r5e4w3q2", type: "weightReps" },
  { name: "Pull Up", id: "908fyv", type: "weightReps" },
  { name: "Row", id: ";lkdfhun897ny381ynf45", type: "weightReps" },
  { name: "Seated Row", id: "s34t3dr0w", type: "weightReps" },
  { name: "Tricep Extension", id: "tr1c3p3xt3ns10n", type: "weightReps" },
  { name: "Plank", id: "pl4nk2024", type: "timeDistance" },
  { name: "Sled Push", id: "sl3dpush2024", type: "timeDistance" },
  { name: "Battle Rope", id: "b4ttl3r0p3", type: "timeDistance" },
  { name: "Treadmill Run", id: "tr34dm1llrun", type: "timeDistance" },
  { name: "Bike Sprint", id: "b1k35pr1nt", type: "timeDistance" },
]

export function ExerciseData() {
  return (
    <Card className="py-0 gap-0">
      <div className="px-2 py-2 text-muted-foreground text-sm">exercise insights</div>
      <div className="border-y">
        <ExerciseSelect exercises={exercises} />
      </div>
      <Stats exerciseId="hjasgkd76i7dib7qk" />
    </Card>
  )
}