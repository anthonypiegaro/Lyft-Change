import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { exercise } from "@/db/schema"

const exercises = [
  { name: "Weighted Swings", sets: 3, unit: ["weight", "swings"] },
  { name: "Hitting Plyos", sets: 4, unit: ["swings", "quality"] },
  { name: "Live BP", sets: 2, unit: ["speed", "outcome"] }
]

export function WorkoutTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {exercises.map(exercise => (
          <div key={exercise.name} className="border rounded-md w-full p-2 bg-input/50">
            <div className="mb-1">{exercise.name}</div>
            <div className="grid grid-cols-4">
              <div className="mx-auto">set</div>
              <div className="text-center">{exercise.unit[0]}</div>
              <div className="text-center">{exercise.unit[1]}</div>
              <div className="text-center">✓</div>
            </div>
            <Separator className="mb-1" />
            {Array.from({ length: exercise.sets }, (_, i) => (
              <div key={i} className="grid grid-cols-4 mb-1">
                <div>
                  <div className="border dark:border-input/50 h-5 w-8 rounded-md mx-auto"/>
                </div>
                <div>
                  <div className="border dark:border-input/50 h-5 w-8 rounded-md mx-auto"/>
                </div>
                <div>
                  <div className="border dark:border-input/50 h-5 w-8 rounded-md mx-auto"/>
                </div>
                <div>
                  <div className="border dark:border-input/50 h-5 w-8 rounded-md mx-auto"/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}