"use client"

import { CalendarEvent, UseCalendarReturn } from "./use-calendar"
import { WorkoutEvent } from "./calendar"
import React from "react"
import { cn } from "@/lib/utils"
import { isSameDay } from "date-fns"

export function WeekView({
  calendar,
  onEventClick,
  onDateClick
}: {
  calendar: UseCalendarReturn<WorkoutEvent>
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
}) {
  const { days, isToday, isSelected, getEventsForWeek } = calendar

  const startOfWeek = days[0]
  const events = getEventsForWeek(startOfWeek)

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 h-full">
        {days.map((day, index) => (
          <div
            key={day.toISOString()}
            className={cn("text-center text-sm font-medium border-r",
              isToday(day) ? "bg-blue-50/10" : ""
            )}
          >
            <div className="border-b p-2 mb-2">
              <div>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}</div>
              <div
                className={cn(
                  "inline-flex items-center justify-center w-6 h-6 mt-1",
                  isToday(day) && "bg-blue-100 text-blue-700 rounded-full",
                  isSelected(day) && !isToday(day) && "bg-gray-500/50 rounded-full"
                )}
              >
                {day.getDate()}
              </div>
            </div>
            {events.filter(event => isSameDay(day, event.date)).map(event => (
              <div
                key={event.id}
                className="h-10 rounded-md px-2 py-1 m-1 text-sm truncate font-medium bg-zinc-400/80 hover:bg-zinc-400"
                onClick={e => handleEventClick(event, e)}
              >
                {event.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}