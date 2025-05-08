import { columns } from "./columns"
import { mockWorkoutData } from "./mock-data"
import { getWorkoutTags } from "./get-workout-tags.action"
import { DataTable } from "../data-table"

export default async function WorkoutPage() {
  const workoutTags = await getWorkoutTags()

  const tagOptions = workoutTags.map(tag => ({
    label: tag.name,
    value: tag.name
  })).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  )

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={mockWorkoutData} 
        filterColumnName="name" 
        tagOptions={tagOptions}
        type="workout"
      />
    </div>
  )
}