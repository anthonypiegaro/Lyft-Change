import { columns } from "./columns"
import { mockExerciseData, mockExerciseTags } from "./mock-data";
import { DataTable } from "../data-table";

export default async function ExercisePage() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const tagOptions = mockExerciseTags.map(tag => ({
    label: tag,
    value: tag,
  })).sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  )

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={mockExerciseData} 
        filterColumnName="name" 
        tagOptions={tagOptions}
        type="exercise"
      />
    </div>
  )
}