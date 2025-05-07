import { columns } from "./columns"
import { mockWorkoutData } from "./mock-data"
import { DataTable } from "../data-table"

export default async function WorkoutPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <div className="container mx-auto px-1">
      <DataTable columns={columns} data={mockWorkoutData} filterColumnName="name" />
    </div>
  )
}