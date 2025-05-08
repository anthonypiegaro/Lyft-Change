import { columns } from "./columns"
import { mockProgramData, mockProgramTags } from "./mock-data"
import { DataTable } from "../data-table"

export default async function ProgramPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const tagOptions = mockProgramTags.map(tag => ({
    label: tag,
    value: tag
  })).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  )

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={mockProgramData} 
        filterColumnName="name" 
        tagOptions={tagOptions}
        type="program"
      />
    </div>
  )
}