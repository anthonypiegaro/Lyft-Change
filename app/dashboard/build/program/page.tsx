import { columns } from "./columns"
import { getProgramTags } from "./get-program-tags.action"
import { DataTable } from "../data-table"

export default async function ProgramPage() {
  const [programTags] = await Promise.all([getProgramTags()])

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={[]} 
        filterColumnName="name" 
        tags={programTags}
        type="program"
      />
    </div>
  )
}