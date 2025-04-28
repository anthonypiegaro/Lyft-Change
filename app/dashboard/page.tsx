import WorkoutForm from "@/components/workout-form/workout-form"

export default function DashboardPage() {
  return (
    <div className="flex grow justify-center items-center">
      <div className="flex h-[90%] w-[80%]">
        <WorkoutForm />
      </div>
    </div>
  )
}