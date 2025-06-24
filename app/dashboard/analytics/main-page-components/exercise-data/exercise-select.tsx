"use client"

import * as React from "react"
import { Dumbbell } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type Exercise = {
  name: string
  id: string
  type: "weightReps" | "timeDistance"
}

export function ExerciseSelect({
  exercises
}: {
  exercises: Exercise[]
}) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(
    null
  )

  if (isMobile) {
    return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="w-[150px] py-5 px-2 justify-start w-full h-full flex items-center gap-x-2 cursor-pointer hover:bg-muted/50">
          <Dumbbell /> <p className="text-xl font-medium">{selectedExercise ? <>{selectedExercise.name}</> : "Set Exercise"}</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Select Exercise</DrawerTitle>
        <div className="mt-4 border-t">
          <ExerciseList exercises={exercises} setOpen={setOpen} setSelectedExercise={setSelectedExercise} />
        </div>
      </DrawerContent>
    </Drawer>
  )
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-[150px] py-5 px-2 justify-start w-full h-full flex items-center gap-x-2 cursor-pointer hover:bg-muted/50">
          <Dumbbell /> <p className="text-xl font-medium">{selectedExercise ? <>{selectedExercise.name}</> : "Set Exercise"}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <ExerciseList exercises={exercises} setOpen={setOpen} setSelectedExercise={setSelectedExercise} />
      </PopoverContent>
    </Popover>
  )
}

function ExerciseList({
  setOpen,
  setSelectedExercise,
  exercises
}: {
  setOpen: (open: boolean) => void
  setSelectedExercise: (exercise: Exercise | null) => void
  exercises: Exercise[]
}) {
  return (
    <Command>
      <CommandInput className="text-base" placeholder="Filter exercises..." />
      <CommandList>
        <CommandEmpty>No exercises found.</CommandEmpty>
        <CommandGroup>
          {exercises.map((exercise) => (
            <CommandItem
              key={exercise.id}
              value={exercise.name}
              onSelect={() => {
                setSelectedExercise(
                  exercises.find((priority) => priority.id === exercise.id) || null
                )
                setOpen(false)
              }}
            >
              {exercise.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
