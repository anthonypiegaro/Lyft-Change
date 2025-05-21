import { CalendarWrapper } from "./calendar-wrapper";
import { getWorkoutInstances } from "./get-workout-instances.action";

export default async function DashboardPage() {
  const workoutEvents = await getWorkoutInstances()

  return (
      <div className="w-full max-h-screen p-4 pt-10">
        <CalendarWrapper events={workoutEvents}/>
      </div>
  )
}