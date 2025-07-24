"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Router } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { Exercise } from "./layout"

export default function ExerciseSelect({
  exercises
}: {
  exercises: Exercise[]
}) {
  const [open, setOpen] = useState(false)
  const [exerciseId, setExerciseId] = useState("")

  const router = useRouter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between mx-auto"
        >
          {exerciseId
            ? exercises.find((exercise) => exercise.id === exerciseId)?.name
            : "Select exercise..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search exercise..." className="h-9" />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup>
              {exercises.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.id}
                  onSelect={(selectedExerciseId) => {
                    setExerciseId(selectedExerciseId === exerciseId ? "" : selectedExerciseId)
                    if (selectedExerciseId !== exerciseId) {
                      router.push(`/dashboard/analytics/exercise/${selectedExerciseId}`)
                    }
                    setOpen(false)
                  }}
                >
                  {exercise.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      exerciseId === exercise.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}