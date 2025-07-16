import Link from "next/link"
import { Calendar, Calendar1, Plus, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { TemplateList } from "./template-list"
import { WorkoutByTemplateDialog } from "./workout-by-template-dialog"

export type Workout = {
  id: string
  name: string
  completed: boolean
  exercises: {
    name: string
    sets: number
  }[]
}

export type Template = {
  id: string
  name: string
  tags: TemplateTag[]
}

export type TemplateTag = {
  id: string
  name: string
}

export function DayPlan({
  todaysWorkouts,
  workoutTemplates,
  templateTags
}: {
  todaysWorkouts: Workout[]
  workoutTemplates: Template[]
  templateTags: TemplateTag[]
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-4">

      <Card className="col-span-4 relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <Calendar1 />
            <h3 className="text-3xl">Today's Plan</h3>
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          {todaysWorkouts.length === 0 && <p className="w-full text-center text-2xl font-medium">No workouts for today</p>}
          {todaysWorkouts.map(workout => (
            <Link key={workout.id} href={`/dashboard/workout/${workout.id}`} className="group">
              <Card className="relative gap-2 transition-all group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800">
                <div className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-full py-1 px-3 text-sm",
                  !workout.completed && "hidden"
                )}>
                  Completed
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {workout.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground max-w-lg">
                  {workout.exercises.map((exercise, index) => (
                    <span key={index}>
                      {
                        index === (workout.exercises.length - 1) 
                        ? exercise.name + " x " + exercise.sets
                        : exercise.name + " x " + exercise.sets + ", "
                      }
                    </span>
                  ))}
                  {workout.exercises.length === 0 && (
                    <div>No exercises</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </CardContent>
        <CardFooter className="max-md:hidden w-full flex flex-row justify-end">
          <Button variant="outline" asChild>
            <Link href="/dashboard/schedular">
              <Calendar />
              Go to schedular
            </Link>
          </Button>
        </CardFooter>
        <CardFooter className="md:hidden flex flex-col">
          <Separator className="mb-4" />
          <Button className="mb-3" asChild>
            <Link href="/dashboard/workout/new">
              Start workout form scratch
            </Link>
          </Button>
          <WorkoutByTemplateDialog workoutTemplates={workoutTemplates} templateTags={templateTags} />
        </CardFooter>
      </Card>
  
      <Card className="max-md:hidden col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <Zap />
            <h3 className="text-3xl">Quick Actions</h3>
          </CardTitle>
          <CardDescription>
            Start a new workout or choose from a template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-center">
            <Button className="mx-auto" asChild>
              <Link href="/dashboard/workout/new">
                <Plus />
                <p>Start workout from scratch</p>
              </Link>
            </Button>
          </div>
          <Separator className="my-4" />
          <div>
            <h3 className="text-xl font-medium mb-4">Start from template</h3>
            <TemplateList templateTags={templateTags} workoutTemplates={workoutTemplates} />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}