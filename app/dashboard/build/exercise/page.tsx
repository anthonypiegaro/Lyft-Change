import { columns } from "./columns"
import { mockExerciseData } from "./mock-data";
import { DataTable } from "../data-table";

export default async function ExercisePage() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <div className="container mx-auto px-1">
      <DataTable columns={columns} data={mockExerciseData} filterColumnName="name" />
    </div>
  )
}