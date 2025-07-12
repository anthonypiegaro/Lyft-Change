"use client"

import { 
  QueryClient, 
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query"

import { Card } from "@/components/ui/card"

import { DayPlan } from "./day-plan"
import { getTodaysWorkouts } from "./get-todays-workouts.action"
import { getWorkoutTemplateTags } from "./get-workout-template-tags.action"
import { getWorkoutTemplates } from "./get-workout-templates.action"
import { DayPlanLoading } from "./day-plan-loading"

const queryClient = new QueryClient()

export function DayPlanWrapper() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const today = `${year}-${month}-${day}`

  return (
    <QueryClientProvider client={queryClient}>
      <DayPlanFetcher date={today} />
    </QueryClientProvider>
  )
}

function DayPlanFetcher({ date }: { date: string }) {
  const todaysWorkouts = useQuery({
    queryKey: ["todaysWorkouts"],
    queryFn: () => getTodaysWorkouts(date)
  })

  const templateTags = useQuery({
    queryKey: ["templateTags"],
    queryFn: getWorkoutTemplateTags
  })

  const workoutTemplates = useQuery({
    queryKey: ["workoutTemplates"],
    queryFn: getWorkoutTemplates
  })

  if (
    todaysWorkouts.isLoading
    || workoutTemplates.isLoading
    || templateTags.isLoading
  ) {
    return <DayPlanLoading />
  } else if (
    todaysWorkouts.isError
    || workoutTemplates.isError
    || templateTags.isError
  ) {
    return (
      <Card>
        <p className="text-2xl text-destructive font-semibold">Error:</p>
        {todaysWorkouts.isError && <p className="text-destructive">{todaysWorkouts.error.message}</p>}
        {workoutTemplates.isError && <p className="text-destructive">{workoutTemplates.error.message}</p>}
        {templateTags.isError && <p className="text-destructive">{templateTags.error.message}</p>}
      </Card>
    )
  } else if (
    todaysWorkouts.data
    && workoutTemplates.data
    && templateTags.data
  ) {
    return (
      <DayPlan 
        todaysWorkouts={todaysWorkouts.data}
        workoutTemplates={workoutTemplates.data}
        templateTags={templateTags.data}
      />
    )
  } else {
    return <DayPlanLoading />
  }
}
