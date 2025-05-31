"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Funnel } from "lucide-react"

import { 
  Card,
  CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { WorkoutItem, WorkoutTag } from "./program-form"
import { WorkoutCard } from "./workout-card"
import { useDndMonitor } from "@dnd-kit/core"

export function WorkoutList({
  workouts,
  tags
}: {
  workouts: WorkoutItem[]
  tags: WorkoutTag[]
}) {
  const parentRef = useRef(null)
  const [nameFilter, setNameFilter] = useState("")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter(workout => workout.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(workout => tagFilter.every(tagId => workout.tags.some(tag => tag.id === tagId)))
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [workouts, nameFilter, tagFilter])

  const getItemKey = useCallback(
    (index: number) => filteredWorkouts[index].workoutId,
    [filteredWorkouts]
  )

  const virtualizer = useVirtualizer({
    count: filteredWorkouts.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 85,
    paddingStart: 10,
    paddingEnd: 10,
    gap: 8
  })

  useDndMonitor({
    onDragStart() { setIsDragging(true) },
    onDragEnd() { setIsDragging(false) }
  })

  return (
    <Card className="w-xs">
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-x-2">
            <Funnel className="w-4 h-4" />
            <h2 className="text-xl font-normal">Workout Library</h2>
          </div>
          <p className="text-muted-foreground text-sm">Drag workouts to add them to your program</p>
        </div>
        <div className="mb-2">
          <Label className="mb-1">Name</Label>
          <Input value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1">Tags</Label>
          <MultiSelect
            options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
            onValueChange={selectedTags => { setTagFilter(selectedTags)}}
            placeholder="Filter tags..."
            defaultValue={tagFilter}
            maxCount={3}
            className="max-w-sm dark:bg-input/30"
          />
        </div>
        <Separator className="my-4" />
        <div
          className={cn(
            "overflow-auto h-80 mask-b-from-97% mask-t-from-97%",
            isDragging && "overflow-hidden"
          )}
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

              return <WorkoutCard key={virtualItem.key} start={virtualItem.start} workout={workout} />
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
