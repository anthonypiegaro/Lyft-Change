import { columns } from "./columns"
import { getProgramTags } from "./get-program-tags.action"
import { getPrograms } from "./get-programs.action"
import { DataTable } from "../data-table"

export default async function ProgramPage() {
  const [programTags, programs] = await Promise.all([getProgramTags(), getPrograms()])

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={programs} 
        filterColumnName="name" 
        tags={programTags}
        type="program"
      />
    </div>
  )
}