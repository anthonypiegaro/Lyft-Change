import { columns } from "./columns"
import { DataTableWrapper } from "./data-table-wrapper"
import { getWorkouts } from "./get-workouts"

export default async function HistoryPage() {
  const workouts = await getWorkouts()

  await new Promise(resolve => setTimeout(resolve, 9000))

  return (
    <div className="mx-auto container py-12 lg:py-10">
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold lg:font-medium mb-4 lg:mb-15">History</h1>
      <DataTableWrapper columns={columns} data={workouts} />
    </div>
  )
}