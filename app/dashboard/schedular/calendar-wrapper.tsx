"use client"

import { Calendar } from "@/components/calendar/calendar"
import { parseISO } from "date-fns"

export type WorkoutEventPreprocessed = {
  id: string
  name: string
  date: string
}

export function CalendarWrapper({
  events
}: {
  events: WorkoutEventPreprocessed[]
}) {
  const parsedEvents = events.map((event) => ({
    ...event,
    date: parseISO(event.date),
  }));

  return <Calendar events={parsedEvents} />
}