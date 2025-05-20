"use client"

import { WorkoutEvent } from "./calendar"
import { CalendarEvent, UseCalendarReturn } from "./use-calendar"

export function DayView({
  calendar,
  onEventClick,
  onDateClick
}: {
  calendar: UseCalendarReturn<WorkoutEvent>
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (event: Date) => void
}) {
  const { currentDate, getEventsForDate } = calendar

  const events = getEventsForDate(currentDate)

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 overflow-y-auto gap-y-2">
        {events.map(event => (
          <div
            key={event.id}
            className="h-20 rounded px-2 py-1 text-sm truncate font-medium bg-zinc-400/80 hover:bg-zinc-400"
            onClick={e => handleEventClick(event, e)}
          >
            {event.name}
          </div>
        ))}
      </div>
    </div>
  )
}
