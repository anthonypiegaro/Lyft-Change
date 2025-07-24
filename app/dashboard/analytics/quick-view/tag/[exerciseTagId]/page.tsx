import { getExerciseTagData } from "./get-exercise-tag-data"
import { TagChart } from "./tag-chart"

export type ExerciseTagData = {
  name: string,
  sets: {
    date: string
  }[]
}

export default async function ExerciseTagAnalytics({
  params
}: {
  params: Promise<{ exerciseTagId: string }>
}) {
  const { exerciseTagId } = await params

  const data = await getExerciseTagData(exerciseTagId)

  if (!data) {
    return (
      <div className="mx-auto text-xl font-semibold" >Exercise does not exist. It may have been deleted.</div>
    )
  }

  return <TagChart exerciseTagData={data} />
}