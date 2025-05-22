import { columns } from "./columns"
import { getWorkoutTags } from "./get-workout-tags.action"
import { DataTable } from "../data-table"
import { getWorkoutTemplates } from "./get-workout-templates.action"

export default async function WorkoutPage() {
  const [workoutTags, workouts] = await Promise.all([getWorkoutTags(), getWorkoutTemplates()])

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={workouts} 
        filterColumnName="name" 
        type="workout"
        tags={workoutTags}
      />
    </div>
  )
}