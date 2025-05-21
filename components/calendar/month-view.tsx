"use client"

import React from "react"

import { cn } from "@/lib/utils"

import { WorkoutEvent } from "./calendar"
import { CalendarEvent, UseCalendarReturn } from "./use-calendar"

export function MonthView({
  calendar,
  onEventClick,
  onDateClick
}: {
  calendar: UseCalendarReturn<WorkoutEvent>
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
}) {
  const { days, isToday, getEventsForDate, currentDate } = calendar

  const currentMonth = currentDate.getMonth()

  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const handleDateClick = (date: Date) => {
    onDateClick?.(date)
  }

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 h-10">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day) => {
              const isCurrentMonth = day.getMonth() === currentMonth
              const events = getEventsForDate(day)
              const maxEventsToShow = 3
              const hasMoreEvents = events.length > maxEventsToShow

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-t border-r p-1 min-h-24 overflow-hidden",
                    weekIndex === 0 && "border-t",
                    !isCurrentMonth && "bg-input",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 text-sm",
                        isToday(day) && "bg-blue-100 text-blue-700 rounded-full font-semibold",
                        !isCurrentMonth && "text-muted-foreground"
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </div>

                  <div className="mt-1 space-y-1 max-h-[calc(100%-1.5rem)] overflow-hidden">
                    {events.slice(0, maxEventsToShow).map((event) => (
                      <div
                        key={event.id}
                        className="px-1 py-0.5 text-xs rounded truncate bg-zinc-400/80 hover:bg-zinc-400"
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        {event.name}
                      </div>
                    ))}

                    {hasMoreEvents && (
                      <div className="px-1 py-0.5 text-xs text-gray-500">+{events.length - maxEventsToShow} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
