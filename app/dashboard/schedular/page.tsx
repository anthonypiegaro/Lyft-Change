import { CalendarWrapper } from "./calendar-wrapper"
import { getWorkoutInstances } from "./get-workout-instances.action"
import { getWorkoutTemplates } from "./get-workout-templates"
import { getWorkoutTags } from "./get-workout-tags"

export default async function DashboardPage() {
  const [workoutEvents, workoutTemplates, tags] = await Promise.all([
    getWorkoutInstances(),
    getWorkoutTemplates(),
    getWorkoutTags()
  ])

  return (
      <div className="w-full max-h-screen p-4 pt-10">
        <CalendarWrapper events={workoutEvents} workoutTemplates={workoutTemplates} tags={tags}/>
      </div>
  )
}