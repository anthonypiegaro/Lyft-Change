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

// const mockWorkouts: Workout[] = [
//   {
//     id: "1",
//     name: "Full Body Strength Day 1",
//     exercises: [
//       {
//         name: "Belt Squat",
//         sets: 3
//       },
//       {
//         name: "Bench Press",
//         sets: 3
//       },
//       {
//         name: "Deadlift",
//         sets: 1
//       },
//       {
//         name: "Pull Ups",
//         sets: 3
//       },
//       {
//         name: "Pull Over (Barbell)",
//         sets: 3
//       },
//       {
//         name: "Standing Calf Raise (machine)",
//         sets: 3
//       },
//       {
//         name: "Cable Crunch",
//         sets: 3
//       },
//     ]
//   },
//   {
//     id: "2",
//     name: "On Ramp Day 1",
//     exercises: [
//       {
//         name: "Dynamic Warmup",
//         sets: 1
//       },
//       {
//         name: "Arm Bands",
//         sets:  1
//       },
//       {
//         name: "Reverse Throws",
//         sets: 2
//       },
//       {
//         name: "Pivot Pick Offs",
//         sets: 2
//       },
//       {
//         name: "Light Catch Play",
//         sets: 1
//       },
//       {
//         name: "Trampoline Rebounds",
//         sets: 3
//       },
//       {
//         name: "Arm Bands",
//         sets: 1
//       },
//     ]
//   }
// ]

// export const mockTemplates: Template[] = [
//   {
//     id: "1",
//     name: "Full Body Blast",
//     tags: [
//       { id: "a", name: "Strength" },
//       { id: "b", name: "Full Body" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Upper Body Power",
//     tags: [
//       { id: "a", name: "Strength" },
//       { id: "c", name: "Upper Body" },
//     ],
//   },
//   {
//     id: "3",
//     name: "Leg Day Supreme",
//     tags: [
//       { id: "a", name: "Strength" },
//       { id: "d", name: "Legs" },
//     ],
//   },
//   {
//     id: "4",
//     name: "Cardio Crusher",
//     tags: [
//       { id: "e", name: "Cardio" },
//       { id: "f", name: "HIIT" },
//     ],
//   },
//   {
//     id: "5",
//     name: "Core Focus",
//     tags: [
//       { id: "g", name: "Core" },
//       { id: "h", name: "Abs" },
//     ],
//   },
//   {
//     id: "6",
//     name: "Push Pull Split",
//     tags: [
//       { id: "a", name: "Strength" },
//       { id: "i", name: "Push" },
//       { id: "j", name: "Pull" },
//     ],
//   },
//   {
//     id: "7",
//     name: "Glute Builder",
//     tags: [
//       { id: "d", name: "Legs" },
//       { id: "k", name: "Glutes" },
//     ],
//   },
//   {
//     id: "8",
//     name: "Mobility Flow",
//     tags: [
//       { id: "l", name: "Mobility" },
//       { id: "m", name: "Stretch" },
//     ],
//   },
//   {
//     id: "9",
//     name: "Athletic Conditioning",
//     tags: [
//       { id: "e", name: "Cardio" },
//       { id: "n", name: "Agility" },
//     ],
//   },
//   {
//     id: "10",
//     name: "Powerlifting Prep",
//     tags: [
//       { id: "a", name: "Strength" },
//       { id: "o", name: "Powerlifting" },
//     ],
//   },
//   {
//     id: "11",
//     name: "Hypertrophy Upper",
//     tags: [
//       { id: "p", name: "Hypertrophy" },
//       { id: "c", name: "Upper Body" },
//     ],
//   },
//   {
//     id: "12",
//     name: "Hypertrophy Lower",
//     tags: [
//       { id: "p", name: "Hypertrophy" },
//       { id: "d", name: "Legs" },
//     ],
//   },
//   {
//     id: "13",
//     name: "Endurance Builder",
//     tags: [
//       { id: "q", name: "Endurance" },
//       { id: "e", name: "Cardio" },
//     ],
//   },
//   {
//     id: "14",
//     name: "Beginner Strength",
//     tags: [
//       { id: "a", name: "Strength" },
//       { id: "r", name: "Beginner" },
//     ],
//   },
//   {
//     id: "15",
//     name: "Advanced HIIT",
//     tags: [
//       { id: "f", name: "HIIT" },
//       { id: "s", name: "Advanced" },
//     ],
//   },
//   {
//     id: "16",
//     name: "Yoga Flow",
//     tags: [
//       { id: "t", name: "Yoga" },
//       { id: "m", name: "Stretch" },
//     ],
//   },
//   {
//     id: "17",
//     name: "Boxing Basics",
//     tags: [
//       { id: "u", name: "Boxing" },
//       { id: "e", name: "Cardio" },
//     ],
//   },
//   {
//     id: "18",
//     name: "Plyometric Power",
//     tags: [
//       { id: "v", name: "Plyometrics" },
//       { id: "n", name: "Agility" },
//     ],
//   },
//   {
//     id: "19",
//     name: "Functional Fitness",
//     tags: [
//       { id: "w", name: "Functional" },
//       { id: "b", name: "Full Body" },
//     ],
//   },
//   {
//     id: "20",
//     name: "Recovery Routine",
//     tags: [
//       { id: "x", name: "Recovery" },
//       { id: "m", name: "Stretch" },
//     ],
//   },
// ];

// export const mockTemplateTags: TemplateTag[] = [
//   { id: "a", name: "Strength" },
//   { id: "b", name: "Full Body" },
//   { id: "c", name: "Upper Body" },
//   { id: "d", name: "Legs" },
//   { id: "e", name: "Cardio" },
//   { id: "f", name: "HIIT" },
//   { id: "g", name: "Core" },
//   { id: "h", name: "Abs" },
//   { id: "i", name: "Push" },
//   { id: "j", name: "Pull" },
//   { id: "k", name: "Glutes" },
//   { id: "l", name: "Mobility" },
//   { id: "m", name: "Stretch" },
//   { id: "n", name: "Agility" },
//   { id: "o", name: "Powerlifting" },
//   { id: "p", name: "Hypertrophy" },
//   { id: "q", name: "Endurance" },
//   { id: "r", name: "Beginner" },
//   { id: "s", name: "Advanced" },
//   { id: "t", name: "Yoga" },
//   { id: "u", name: "Boxing" },
//   { id: "v", name: "Plyometrics" },
//   { id: "w", name: "Functional" },
//   { id: "x", name: "Recovery" },
// ];

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
                  "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-full p-1 text-sm",
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