"use client"

import { useState } from "react"
import { DragStartEvent, DragEndEvent, useDndMonitor, useDraggable } from "@dnd-kit/core"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { WorkoutItem } from "./program-form"

export function WorkoutCard({
  start,
  workout
}: {
  start: number,
  workout: WorkoutItem
}) {
  const [isDragging, setIsDragging] = useState(false)

  const {attributes, listeners, setNodeRef} = useDraggable({
    id: workout.workoutId,
    data: {
      workout,
      start
    }
  });

  useDndMonitor({
    onDragStart(event: DragStartEvent) {
      if (event.active.id === workout.workoutId) {
        setIsDragging(true)
      }
    },
    onDragEnd(event: DragStartEvent) {
      if (event.active.id === workout.workoutId) {
        setIsDragging(false)
      }
    }
  })

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "85px",
        width: "100%",
        transform: `translateY(${start}px)`,
      }}
      className={cn(
        "flex flex-row items-center max-w-full cursor-move transition-all hover:shadow-md hover:border-primary/50 touch-none",
        isDragging && "opacity-50"
      )}
    >
      <CardContent className="max-w-full">
        <h3 className="font-medium">
          {workout.name}
        </h3>
        <p className="truncate">
          {workout.tags.map(tag => <Badge key={tag.id} className="mr-1">{tag.name}</Badge>)}
        </p>
      </CardContent>
    </Card>
  )
}

export function WorkoutCardPlain({
  workout,
  start
}: {
  workout: WorkoutItem
  start: number
}) {
  return (
    <Card
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "85px",
        width: "100%",
        transform: `translateY(${start}px)`,
      }}
      className="flex flex-row items-center max-w-full cursor-move transition-all hover:shadow-md hover:border-primary/50 touch-none"
    >
      <CardContent className="max-w-full">
        <h3 className="font-medium">
          {workout.name}
        </h3>
        <p className="truncate">
          {workout.tags.map(tag => <Badge key={tag.id} className="mr-1">{tag.name}</Badge>)}
        </p>
      </CardContent>
    </Card>
  )
}