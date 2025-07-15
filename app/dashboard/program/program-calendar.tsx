"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, Plus, X } from "lucide-react"
import { FieldArrayWithId } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { ProgramFormSchema } from "./program-form"

export function ProgramCalendar({
  weeks,
  onAddWeek,
  maxHeight,
  workouts,
  onRemoveWorkout
}: {
  weeks: number
  onAddWeek: () => void
  maxHeight: number,
  workouts: FieldArrayWithId<ProgramFormSchema, "workouts", "id">[]
  onRemoveWorkout: (fieldId: string) => void
}) {
  const headerRef = useRef<HTMLDivElement>(null)
  const daysRef = useRef<HTMLDivElement>(null)
  const [calendarMaxHeight, setCalendarMaxHeight] = useState(0)

  useLayoutEffect(() => {
    if (headerRef.current) {
      setCalendarMaxHeight(maxHeight - headerRef.current.offsetHeight - 24 - 8);
    }
  }, [maxHeight])

  useLayoutEffect(() => {
    if (daysRef.current) {
      daysRef.current.scrollTo({
        top: daysRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [weeks]);

  return (
    <Card className={"lg:max-h-full py-[12px]"}>
      <CardContent className="lg:max-h-full py-0 my-0">
        <div ref={headerRef} className="mb-[8px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-2">
              <Calendar className="w-4.1 h-4.1" />
              <h2 className="text-xl font-normal">Program Calendar</h2>
            </div>
            <Button onClick={onAddWeek}>
              <Plus /> Add Week
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mb-0">Your program schedule - drag workouts from the library to get started</p>
        </div>
        <div className="grid grid-cols-7 gap-3 pb-1 overflow-auto sm:overflow-x-hidden" style={{ maxHeight: calendarMaxHeight }} ref={daysRef}>
          {Array.from({ length: weeks * 7}, (_, i) => {
            return (
              <Date key={i} day={i} workouts={workouts} onRemoveWorkout={onRemoveWorkout}/>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function Date({
  day,
  workouts,
  onRemoveWorkout,
}: {
  day: number
  workouts: FieldArrayWithId<ProgramFormSchema, "workouts", "id">[]
  onRemoveWorkout: (fieldId: string) => void
}) {

  const { setNodeRef, isOver } = useDroppable({
    id: day
  })

  return (
    <div 
      className={cn(
        "flex flex-col items-center h-32 overflow-auto transition-all border-2 border-dashed rounded-md",
        isOver && "border-muted-foreground scale-101"
      )}
      ref={setNodeRef}
    >
      <p className="py-1">Day {day}</p>
      <div className="w-full">
        {workouts.map((workout, index) => workout.day === day && (
          <CalendarWorkoutEvent key={workout.id} fieldIndex={index} workout={workout} onRemoveWorkout={onRemoveWorkout} />
        ))}
      </div>
    </div>
  )
}

function CalendarWorkoutEvent({
  workout,
  onRemoveWorkout,
  fieldIndex,
}: {
  workout: FieldArrayWithId<ProgramFormSchema, "workouts", "id">
  onRemoveWorkout: (fieldId: string) => void
  fieldIndex: number
}) {
  const { setNodeRef, listeners, attributes, active } = useDraggable({
    id: workout.id,
    data: { 
      workout,
      fieldIndex }
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex justify-between items-center text-xs mb-1 rounded bg-zinc-400/80 hover:bg-zinc-400 cursor-grab",
        active && "opacity-50"
      )}
    >
      <span 
        className="flex-1 truncate pl-1" 
        {...listeners}
        {...attributes}
      >
        {workout.name}
      </span>
      <div onClick={() => onRemoveWorkout(workout.id)} className="hover:bg-accent p-1 mr-1 dark:hover:bg-accent/50 transition-all rounded-md flex-shrink-0 ml-2 cursor-pointer">
        <X className="w-3 h-3"/>
      </div>
    </div>
  )
}

export function OverlayCalendarWorkoutEvent({
  workoutName
}: {
  workoutName: string
}) {
  return (
    <div
      className="flex justify-between items-center px-1 py-0.5 text-xs mb-1 rounded bg-zinc-400/80 hover:bg-zinc-400 cursor-grab"
    >
      <span className="truncate">{workoutName}</span>
    </div>
  )
}


