"use client"

import { useState } from "react"
import { isSameDay } from "date-fns"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CalendarEvent, UseCalendarReturn } from "@/components/calendar/use-calendar"
import { cn } from "@/lib/utils"

import { WorkoutEvent } from "./calendar"
import { DailyEventsDialog } from "./daily-events-dialog"

function formatDate(date: Date): string {
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
}

export function WeekView({
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
  const [dailyEventsDate, setDailyEventsDate] = useState<Date | null>()

  const { days, isToday, isSelected, getEventsForDate, getEventsForWeek } = calendar

  const dailyEvents = dailyEventsDate ? getEventsForDate(dailyEventsDate) : []

  const startOfWeek = days[0]
  const events = getEventsForWeek(startOfWeek)

  const handleEventClick = (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  const handleDeleteClick = (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteClick?.(event.id, event.name)
  }

  const handleDailyDialogOpen = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation()
    setDailyEventsDate(date)
  }

  const handleDailyEventsOpenChange = (open: boolean) => {
    if (!open) {
      setDailyEventsDate(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 h-full">
        {days.map((day, index) => (
          <div
            key={day.toISOString()}
            className={cn("relative text-center text-sm font-medium border-r min-h-40",
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
            <div>
              <div
                className="md:hidden absolute top-0 left-0 w-full h-full z-10"
                onClick={e => handleDailyDialogOpen(day, e)}
              />
              {events.filter(event => isSameDay(day, event.date)).map(event => (
                <div
                  key={event.id}
                  className="flex justify-between items-center truncate md:h-10 rounded-md pl-1 md:px-2 py-1 m-1 max-md:text-xs max-md:font-normal text-sm truncate font-medium bg-zinc-400/80 hover:bg-zinc-400 cursor-pointer"
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