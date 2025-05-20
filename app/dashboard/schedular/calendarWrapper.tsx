"use client"

import { Calendar } from "@/components/calendar/calendar"
import { parseISO } from "date-fns"

export function CalendarWrapper({
  events
}: {
  events: {
    id: string
    name: string
    date: string
  }[]
}) {
  const parsedEvents = events.map((event) => ({
    ...event,
    date: parseISO(event.date),
  }));

  return <Calendar events={parsedEvents} />
}