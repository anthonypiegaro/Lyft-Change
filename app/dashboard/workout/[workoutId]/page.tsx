export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: number }>
}) {
  const { workoutId } = await params

  return (
    <h1>Workout Page for the workout with id: {workoutId}</h1>
  )
}