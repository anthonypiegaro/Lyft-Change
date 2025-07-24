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

import { ExerciseTag } from "./layout"

export function TagSelect({
  exerciseTags
}: {
  exerciseTags: ExerciseTag[]
}) {
  const [open, setOpen] = useState(false)
  const [exerciseTagId, setExerciseTagId] = useState("")

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
          {exerciseTagId
            ? exerciseTags.find((exercise) => exercise.id === exerciseTagId)?.name
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
              {exerciseTags.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.id}
                  onSelect={(selectedExerciseId) => {
                    setExerciseTagId(selectedExerciseId === exerciseTagId ? "" : selectedExerciseId)
                    if (selectedExerciseId !== exerciseTagId) {
                      router.push(`/dashboard/analytics/tag/${selectedExerciseId}`)
                    }
                    setOpen(false)
                  }}
                >
                  {exercise.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      exerciseTagId === exercise.id ? "opacity-100" : "opacity-0"
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