"use client"

import React, { useMemo, useState } from "react"
import { Trash } from "lucide-react"

import { CalendarEvent, UseCalendarReturn } from "@/components/calendar/use-calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { WorkoutEvent } from "./calendar"
import { DailyEventsDialog } from "./daily-events-dialog"

function formatDate(date: Date): string {
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
}

export function MonthView({
  calendar,
  onEventClick,
  onDateClick,
  onDeleteClick,
  inEditMode
}: {
  calendar: UseCalendarReturn<WorkoutEvent>
  onEventClick?: (event: CalendarEvent<WorkoutEvent>) => void
  onDateClick?: (date: Date) => void
  onDeleteClick?: (id: string, name: string) => void
  inEditMode: boolean
}) {
  const [dailyEventsDate, setDailyEventsDate] = useState<Date | null>()

  const { days, isToday, getEventsForDate, currentDate } = calendar

  const dailyEvents = dailyEventsDate ? getEventsForDate(dailyEventsDate) : []

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

  const handleEventClick = (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  const handleDeleteClick = (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteClick?.(event.id, event.name)
  }

  const handleDailyEventsOpenChange = (open: boolean) => {
    if (!open) {
      setDailyEventsDate(null)
    }
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

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative border-t border-r p-1 min-h-24 overflow-hidden",
                    weekIndex === 0 && "border-t",
                    !isCurrentMonth && "bg-input",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div 
                    className="md:hidden absolute top-0 left-0 w-full h-full z-10"
                    onClick={() => setDailyEventsDate(day)}
                  />
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
                    {events.map((event) => (
                      <React.Fragment key={event.id}>
                      <div
                        key={event.id}
                        className="max-md:hidden flex justify-between items-center px-1 py-0.5 text-xs rounded bg-zinc-400/80 hover:bg-zinc-400 cursor-pointer"
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        <p className="text-sm truncate">{event.name}</p>
                        <Button 
                          variant="ghost" 
                          className={cn("h-auto w-auto min-w-0 min-h-0 cursor-pointer", !inEditMode && "hidden")}
                          onClick={e => handleDeleteClick(event, e)}
                        >
                          <Trash className="text-destructive w-1 h-1" />
                        </Button>
                      </div>
                      <div className="md:hidden h-3 w-3 rounded-full bg-zinc-400/80" />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
      <DailyEventsDialog 
        open={dailyEventsDate ? true : false}
        onOpenChange={handleDailyEventsOpenChange}
        events={dailyEvents}
        date={formatDate(dailyEventsDate ?? new Date())}
        onEventClick={handleEventClick}
        onDeleteClick={handleDeleteClick}
      />
    </div>
  )
}
