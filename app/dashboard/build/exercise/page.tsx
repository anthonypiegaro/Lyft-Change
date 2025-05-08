import { columns } from "./columns"
import { getExerciseTags } from "./get-exercise-tags.action";
import { mockExerciseData } from "./mock-data";
import { DataTable } from "../data-table";

export default async function ExercisePage() {
  const exerciseTags = await getExerciseTags()

  const tagOptions = exerciseTags.map(tag => ({
    label: tag.name,
    value: tag.name,
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