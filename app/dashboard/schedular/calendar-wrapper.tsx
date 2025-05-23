"use client"

import { useRouter } from "next/navigation"

import { Calendar, Tag, WorkoutEvent, WorkoutTemplate } from "@/components/calendar/calendar"
import { CalendarEvent } from "@/components/calendar/use-calendar"
import { parseISO } from "date-fns"

export type WorkoutEventPreprocessed = {
  id: string
  name: string
  date: string
}

export function CalendarWrapper({
  events,
  workoutTemplates,
  tags
}: {
  events: WorkoutEventPreprocessed[]
  workoutTemplates: WorkoutTemplate[]
  tags: Tag[]
}) {
  const parsedEvents = events.map((event) => ({
    ...event,
    date: parseISO(event.date),
  }));

  const router = useRouter()

  const handleEventClick = (event: CalendarEvent<WorkoutEvent>) => {
    router.push(`/dashboard/workout/${event.id}`)
  }

  return <Calendar events={parsedEvents} onEventClick={handleEventClick} workoutTemplates={workoutTemplates} tags={tags}/>
}