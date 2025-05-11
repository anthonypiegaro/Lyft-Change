import { WorkoutForm } from "@/app/dashboard/workout/workout-form"

export default function NewWorkoutPage() {
  const defaultValues = {
    name: "New Workout",
    date: new Date(),
    notes: "",
    exercises: []
  }

  return (
    <div className="flex justify-center w-full py-10 pb-20 md:pb-10 md:px-0 px-4">
      <WorkoutForm workoutType="template" defaultValues={defaultValues} />
    </div>
  )
}