import { columns } from "./columns"
import { mockProgramData } from "./mock-data"
import { DataTable } from "../data-table"

export default async function ProgramPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <div className="container mx-auto px-1">
      <DataTable columns={columns} data={mockProgramData} filterColumnName="name" />
    </div>
  )
}