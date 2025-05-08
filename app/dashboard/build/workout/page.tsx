import { columns } from "./columns"
import { mockWorkoutData, mockWorkoutTags } from "./mock-data"
import { DataTable } from "../data-table"

export default async function WorkoutPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const tagOptions = mockWorkoutTags.map(tag => ({
    label: tag,
    value: tag
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