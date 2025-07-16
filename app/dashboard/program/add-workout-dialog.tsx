"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { WorkoutItem, WorkoutTag } from "./program-form"

export function AddWorkoutDialog({
  open,
  onOpenChange,
  addWorkoutToDay,
  workoutTags,
  workouts,
  weeks
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  addWorkoutToDay: (workout: { name: string, workoutId: string, day: number }) => void
  workoutTags: WorkoutTag[]
  workouts: WorkoutItem[]
  weeks: number
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-0 overflow-auto"> 
        <DialogHeader className="px-6">
          <DialogTitle>
            Add Workout to Program
          </DialogTitle>
          <DialogDescription>
            Select a single or multiple days to add the workout
          </DialogDescription>
        </DialogHeader>
        <Content 
          close={() => onOpenChange(false)}
          addWorkoutToDay={addWorkoutToDay}
          workoutTags={workoutTags}
          workouts={workouts}
          weeks={weeks}
        />
      </DialogContent>
    </Dialog>
  )
}

export function Content({
  addWorkoutToDay,
  workoutTags,
  workouts,
  close,
  weeks
}: {
  addWorkoutToDay: (workout: { name: string, workoutId: string, day: number }) => void
  workoutTags: WorkoutTag[]
  workouts: WorkoutItem[]
  close: () => void
  weeks: number
}) {
  const parentRef = useRef(null)
  const [nameFilter, setNameFilter] = useState("")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<{ name: string, workoutId: string } | null>(null)
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter(workout => workout.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(workout => tagFilter.every(
        tag => workout.tags.some(workoutTag => workoutTag.id === tag)
      ))
  }, [workouts, nameFilter, tagFilter])

  const getItemKey = useCallback(
    (index: number) => filteredWorkouts[index].workoutId,
    [filteredWorkouts]
  )

  const virtualizer = useVirtualizer({
    count: filteredWorkouts.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 65
  })

  const handleWorkoutSelect = (workout: { name: string, workoutId: string }) => {
    if (selectedWorkout?.workoutId === workout.workoutId) {
      setSelectedWorkout(null)
    } else {
      setSelectedWorkout(workout)
    }
  }

  const handleWorkoutAdd = () => {
    for (const day of selectedDays) {
      addWorkoutToDay({ name: selectedWorkout?.name!, workoutId: selectedWorkout?.workoutId!, day })
    }
    close()
  }

  return (
    <div>
      <div className="px-6 mb-4">
        <Label className="mb-2">Select Days</Label>
        <MultiSelect 
          options={Array.from({ length: weeks * 7 }, (_, i) => ({ label: i.toString(), value: i.toString()}))}
          onValueChange={selectedDays => { setSelectedDays(selectedDays.map(day => Number(day)))}}
          placeholder="Select days to add workout..."
          defaultValue={selectedDays.map(day => day.toString())}
          maxCount={3}
          portalRemoved
          className="max-w-sm dark:bg-input/30"
        />
        <div className="my-4">
          <Label className="mb-2">Name Filter</Label>
          <Input value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
        </div>
        <div>
          <Label className="mb-2">Tag Filter</Label>
          <MultiSelect 
            options={workoutTags.map(tag => ({ label: tag.name, value: tag.id }))}
            onValueChange={selectedTags => { setTagFilter(selectedTags)}}
            placeholder="Filter tags..."
            defaultValue={tagFilter}
            maxCount={2}
            className="max-w-sm dark:bg-input/30"
          />
        </div>
      </div>
      <Separator />
      <div
        className="overflow-auto h-80 mask-b-from-97% mask-t-from-97%"
        ref={parentRef}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {virtualizer.getVirtualItems().map(virtualItem => {
            const workout = filteredWorkouts[virtualItem.index]

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: "65px",
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className={cn(
                  "flex flex-col justify-center px-6 py-1 border-b hover:bg-accent flex flex-col",
                  selectedWorkout?.workoutId === workout.workoutId && "bg-accent/80"
                )}
                onClick={() => handleWorkoutSelect({ name: workout.name, workoutId: workout.workoutId })}
              >
                <div className="text-lg font-medium truncate">{workout.name}</div>
                <div className="truncate">
                  {workout.tags.length === 0 && <p className="text-sm text-muted-foreground">No tags</p>}
                  {workout.tags.map(tag => (
                    <Badge key={tag.id} className="mr-1">{tag.name}</Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="px-6 flex justify-end">
        <Button 
          disabled={selectedDays.length === 0 || !selectedWorkout}
          onClick={handleWorkoutAdd}
        >
          Add Workout
        </Button>
      </div>
    </div>
  )
}
