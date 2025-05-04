export default async function WorkoutPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <div>Workout Page</div>
  )
}