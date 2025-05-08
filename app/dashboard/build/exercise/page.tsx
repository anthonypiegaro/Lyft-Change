import { columns } from "./columns"
import { getExerciseTags } from "./get-exercise-tags.action";
import { mockExerciseData } from "./mock-data";
import { DataTable } from "../data-table";

export default async function ExercisePage() {
  const exerciseTags = await getExerciseTags()

  return (
    <div className="container mx-auto px-1">
      <DataTable 
        columns={columns} 
        data={mockExerciseData} 
        filterColumnName="name"
        type="exercise"
        tags={exerciseTags}
      />
    </div>
  )
}