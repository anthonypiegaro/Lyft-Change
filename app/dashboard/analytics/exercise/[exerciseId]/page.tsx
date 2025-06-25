export default async function ExercisePage({
  params
}: {
  params: Promise<{ exerciseId: string }>
}) {
  const { exerciseId } = await params

  return (
    <>{exerciseId}</>
  )
}