import { columns } from "./columns"
import { DataTableWrapper } from "./data-table-wrapper"
import { getWorkouts } from "./get-workouts"

export default async function HistoryPage() {
  const workouts = await getWorkouts()

  await new Promise(resolve => setTimeout(resolve, 1000))

  return (
    <div className="mx-auto container py-10">
      <h1 className="text-4xl lg:text-5xl xl:text-6xl semi-bold mb-15">History</h1>
      <DataTableWrapper columns={columns} data={workouts} />
    </div>
  )
}