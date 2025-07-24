import { getExerciseTags } from "./get-exercise-tags"
import { TagSelect } from "./tag-select"

export type ExerciseTag = {
  id: string,
  name: string
}

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const exerciseTags = await getExerciseTags()

  return (
    <>
      <div className="w-full flex justify-center my-4">
        <TagSelect exerciseTags={exerciseTags} />
      </div>
      {children}
    </>
  )
}