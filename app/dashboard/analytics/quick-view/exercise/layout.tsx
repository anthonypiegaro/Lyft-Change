import ExerciseSelect from "./exercise-select"
import { getExercises } from "./get-exercises"

export type Exercise = {
  id: string
  name: string
  type: string
}

export default async function ExerciseLayout({
  children
}: {
  children: React.ReactNode
}) {
  const exercises = await getExercises()

  exercises.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

  return (
    <>
      <div className="w-full flex justify-center my-4">
        <ExerciseSelect exercises={exercises} />
      </div>
      {children}
    </>
  )
}