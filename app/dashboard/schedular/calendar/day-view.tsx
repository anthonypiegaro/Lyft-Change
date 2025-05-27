"use client"

import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CalendarEvent, UseCalendarReturn } from "@/components/calendar/use-calendar"
import { cn } from "@/lib/utils"

import { WorkoutEvent } from "./calendar"

export function DayView({
  calendar,
  onEventClick,
  onDeleteClick,
  inEditMode
}: {
  calendar: UseCalendarReturn<WorkoutEvent>
  onEventClick?: (event: CalendarEvent<WorkoutEvent>) => void
  onDeleteClick?: (id: string, name: string) => void
  inEditMode: boolean
}) {
  const { currentDate, getEventsForDate } = calendar

  const events = getEventsForDate(currentDate)

  const handleEventClick = (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  const handleDeleteClick = (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteClick?.(event.id, event.name)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto gap-y-2">
        {events.map(event => (
          <div
            key={event.id}
            className="flex justify-between items-center h-20 rounded px-2 py-1 text-sm truncate font-medium bg-zinc-400/80 hover:bg-zinc-400 cursor-pointer"
            onClick={e => handleEventClick(event, e)}
          >
            {event.name}
            <Button 
              variant="ghost" 
              className={cn("h-auto w-auto min-w-0 min-h-0 cursor-pointer", !inEditMode && "hidden")}
              onClick={e => handleDeleteClick(event, e)}
            >
              <Trash className="text-destructive w-1 h-1" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
