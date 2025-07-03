import { NavTabs } from "./dashboard/nav-tabs/nav-tabs";
import { DayPlan } from "./dashboard/day-plan/day-plan";
import { getWorkoutTemplateTags } from "./dashboard/day-plan/get-workout-template-tags.action";
import { getWorkoutTemplates } from "./dashboard/day-plan/get-workout-templates.action";
import { getTodaysWorkouts } from "./dashboard/day-plan/get-todays-workouts.action";

export default async function DashboardPage() {
  const [
    templateTags, 
    workoutTemplates,
    todaysWorkouts
  ] = await Promise.all([
    getWorkoutTemplateTags(),
    getWorkoutTemplates(),
    getTodaysWorkouts()
  ])

  return (
      <div className="mx-auto container flex flex-col gap-y-6 w-full max-h-screen p-4 pt-15">
        <div className="max-md:hidden flex justify-between gap-x-4">
          <NavTabs />
        </div>
        <DayPlan todaysWorkouts={todaysWorkouts} workoutTemplates={workoutTemplates} templateTags={templateTags} />
      </div>
  )
}