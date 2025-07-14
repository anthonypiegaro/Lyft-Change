import { CalendarWrapper } from "./calendar-wrapper"
import { getWorkoutInstances } from "./get-workout-instances.action"
import { getWorkoutTemplates } from "./get-workout-templates"
import { getWorkoutTags } from "./get-workout-tags"
import { getPrograms } from "./get-programs.action"
import { getProgramTags } from "./get-program-tags.action"

export default async function DashboardPage() {
  const [
    workoutEvents, 
    workoutTemplates, 
    tags,
    programs,
    programTags
  ] = await Promise.all([
    getWorkoutInstances(),
    getWorkoutTemplates(),
    getWorkoutTags(),
    getPrograms(),
    getProgramTags()
  ])

  return (
    <div className="w-full md:p-4 py-20 md:py-15">
      <CalendarWrapper 
        events={workoutEvents} 
        workoutTemplates={workoutTemplates} 
        tags={tags}
        programs={programs}
        programTags={programTags}
      />
    </div>
  )
}