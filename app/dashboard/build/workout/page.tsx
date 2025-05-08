import { columns } from "./columns"
import { mockWorkoutData } from "./mock-data"
import { getWorkoutTags } from "./get-workout-tags.action"
import { DataTable } from "../data-table"

export default async function WorkoutPage() {
  const workoutTags = await getWorkoutTags()

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={mockWorkoutData} 
        filterColumnName="name" 
        type="workout"
        tags={workoutTags}
      />
    </div>
  )
}