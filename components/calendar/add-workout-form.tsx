"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import  { useVirtualizer } from "@tanstack/react-virtual"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"

import { Tag } from "./calendar"
import { WorkoutTemplate } from "./calendar"
import { DateInput } from "./date-input"

const mockWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: "1",
    name: "Full Body Strength",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "full-body", label: "Full Body" },
      { value: "beginner", label: "Beginner" },
    ],
  },
  {
    id: "2",
    name: "HIIT Cardio Blast",
    tags: [
      { value: "cardio", label: "Cardio" },
      { value: "hiit", label: "HIIT" },
      { value: "fat-burn", label: "Fat Burn" },
    ],
  },
  {
    id: "3",
    name: "Upper Body Pump",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "upper-body", label: "Upper Body" },
      { value: "intermediate", label: "Intermediate" },
    ],
  },
  {
    id: "4",
    name: "Lower Body Burn",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "lower-body", label: "Lower Body" },
      { value: "glutes", label: "Glutes" },
    ],
  },
  {
    id: "5",
    name: "Core Crusher",
    tags: [
      { value: "core", label: "Core" },
      { value: "abs", label: "Abs" },
      { value: "bodyweight", label: "Bodyweight" },
    ],
  },
  {
    id: "6",
    name: "Yoga Flow",
    tags: [
      { value: "yoga", label: "Yoga" },
      { value: "flexibility", label: "Flexibility" },
      { value: "mobility", label: "Mobility" },
    ],
  },
  {
    id: "7",
    name: "Powerlifting Basics",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "powerlifting", label: "Powerlifting" },
      { value: "barbell", label: "Barbell" },
    ],
  },
  {
    id: "8",
    name: "Endurance Run",
    tags: [
      { value: "cardio", label: "Cardio" },
      { value: "endurance", label: "Endurance" },
      { value: "running", label: "Running" },
    ],
  },
  {
    id: "9",
    name: "Tabata Express",
    tags: [
      { value: "hiit", label: "HIIT" },
      { value: "tabata", label: "Tabata" },
      { value: "quick", label: "Quick" },
    ],
  },
  {
    id: "10",
    name: "Push Pull Legs",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "split", label: "Split" },
      { value: "advanced", label: "Advanced" },
    ],
  },
  {
    id: "11",
    name: "Mobility Morning",
    tags: [
      { value: "mobility", label: "Mobility" },
      { value: "stretch", label: "Stretch" },
      { value: "morning", label: "Morning" },
    ],
  },
  {
    id: "12",
    name: "Pilates Core",
    tags: [
      { value: "pilates", label: "Pilates" },
      { value: "core", label: "Core" },
      { value: "low-impact", label: "Low Impact" },
    ],
  },
  {
    id: "13",
    name: "Kettlebell Circuit",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "kettlebell", label: "Kettlebell" },
      { value: "circuit", label: "Circuit" },
    ],
  },
  {
    id: "14",
    name: "Bodyweight Basics",
    tags: [
      { value: "bodyweight", label: "Bodyweight" },
      { value: "beginner", label: "Beginner" },
      { value: "no-equipment", label: "No Equipment" },
    ],
  },
  {
    id: "15",
    name: "Athletic Conditioning",
    tags: [
      { value: "conditioning", label: "Conditioning" },
      { value: "agility", label: "Agility" },
      { value: "sports", label: "Sports" },
    ],
  },
  {
    id: "16",
    name: "Stretch & Recover",
    tags: [
      { value: "recovery", label: "Recovery" },
      { value: "stretch", label: "Stretch" },
      { value: "flexibility", label: "Flexibility" },
    ],
  },
  {
    id: "17",
    name: "Dumbbell Shred",
    tags: [
      { value: "strength", label: "Strength" },
      { value: "dumbbell", label: "Dumbbell" },
      { value: "fat-burn", label: "Fat Burn" },
    ],
  },
  {
    id: "18",
    name: "Cardio Kickboxing",
    tags: [
      { value: "cardio", label: "Cardio" },
      { value: "kickboxing", label: "Kickboxing" },
      { value: "high-energy", label: "High Energy" },
    ],
  },
  {
    id: "19",
    name: "Glute Builder",
    tags: [
      { value: "glutes", label: "Glutes" },
      { value: "lower-body", label: "Lower Body" },
      { value: "strength", label: "Strength" },
    ],
  },
  {
    id: "20",
    name: "Sprint Intervals",
    tags: [
      { value: "cardio", label: "Cardio" },
      { value: "intervals", label: "Intervals" },
      { value: "sprints", label: "Sprints" },
    ],
  },
];

export function AddWorkoutForm({ 
  tags,
  workoutTemplates,
  open,
  onOpenChange,
  onAdd,
  disabled
}: {
  tags: Tag[],
  workoutTemplates: WorkoutTemplate[]
  open: boolean
  onOpenChange: (state: boolean) => void
  onAdd: (ids: string[], date: Date) => void
  disabled: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl mx-2">
        <DialogHeader>
          <DialogTitle>Add Workout</DialogTitle>
        </DialogHeader>
        <Form tags={tags} workoutTemplates={workoutTemplates} onAdd={onAdd} disabled={disabled} />
      </DialogContent>
    </Dialog>
  )
}

function Form({
  tags,
  workoutTemplates,
  onAdd,
  disabled
}: {
  tags: Tag[],
  workoutTemplates: WorkoutTemplate[]
  onAdd: (ids: string[], date: Date) => void
  disabled: boolean
}) {
  const parentRef = useRef(null)
  const [selectedWorkouts, setSelectedWorkout] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [nameFilter, setNameFilter] = useState<string>("")
  const [tagIdsFilter, setTagIdsFilter] = useState<string[]>([])

  const filteredWorkouts = useMemo(() => {
    return mockWorkoutTemplates
      .filter(workout => workout.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(workout => (
        tagIdsFilter.every(
          tagId => workout.tags.some(
            workoutTag => workoutTag.value === tagId
        ))
      ))
    },
    [nameFilter, tagIdsFilter]
  )

  const getItemKey = useCallback(
    (index: number) => filteredWorkouts[index].id,
    [filteredWorkouts]
  )

  const rowVirtualizer = useVirtualizer({
    count: filteredWorkouts.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 85
  })

  const handleWorkoutSelect = (id: string) => {
    setSelectedWorkout(prev => {
      if (prev.includes(id)) {
        return prev.filter(workoutId => workoutId !== id)
      }

      return [...prev, id]
    })
  }

  const handleOnAddClick = async () => {
    if (selectedWorkouts.length === 0  || date == undefined) {
      return
    }

    onAdd(selectedWorkouts, date)
  }

  return (
    <>
      <div>
        <DateInput date={date} onChange={setDate} disabled={disabled} />
      </div>
      <div>
        <Label htmlFor="name-filter" className="mb-1.5">Name Filter</Label>
        <Input id="name-filter" value={nameFilter} onChange={e => setNameFilter(e.target.value)} disabled={disabled} />
      </div>
      <div>
        <Label htmlFor="tag-ids-filter" className="mb-1.5">Tags</Label>
        <MultiSelect
          id="tag-ids-filter"
          options={tags}
          maxCount={3}
          onValueChange={setTagIdsFilter}
          className="dark:bg-input/30"
          disabled={disabled}
        />
      </div>
      <div ref={parentRef} className={cn("h-86 relative w-full overflow-auto mask-b-from-95% mask-t-from-95%", disabled && "overflow-hidden")}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualItem => (
            <div 
              key={virtualItem.key} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: "85px",
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className={cn(
                "py-1 border-b hover:bg-accent flex flex-col justify-center",
                selectedWorkouts.some(selectedWorkout => selectedWorkout === filteredWorkouts[virtualItem.index].id) && "bg-neutral-600 hover:bg-neutral-700"
              )}
              onClick={disabled ? () => {} : () => handleWorkoutSelect(filteredWorkouts[virtualItem.index].id)}
            >
              <div className="text-lg font-medium w-full truncate">
                {filteredWorkouts[virtualItem.index].name}
              </div>
              <div className="w-full truncate">
                {filteredWorkouts[virtualItem.index].tags.map(tag => (
                  <Badge key={tag.value} className="mr-1">{tag.label}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        {disabled && <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-50 pointer-events-auto" />}
      </div>
      <Button type="button" disabled={selectedWorkouts.length < 1 || date == undefined || disabled} onClick={handleOnAddClick}>
        Add Workout{selectedWorkouts.length > 1 && "s"}{selectedWorkouts.length > 1 && ` (${selectedWorkouts.length})`}
      </Button>
    </>
  )
}
