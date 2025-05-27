"use client"

import { useCallback, useMemo, useState } from "react"

export type CalendarView = "month" | "week" | "day"

export interface CalendarBaseEvent {
  id: string
  date: Date
}

export type CalendarEvent<T = {}> = CalendarBaseEvent & T

export interface CalendarState<T> {
  currentDate: Date
  view: CalendarView
  events: CalendarEvent<T>[]
}

export interface CalendarActions<T> {
  setView: (view: CalendarView) => void
  goToDate: (date: Date) => void
  goToToday: () => void
  goToPrev: () => void
  goToNext: () => void
  addEvent: (event: CalendarEvent<T>) => void
  addEvents: (events: CalendarEvent<T>[]) => void
  updateEvent: (event: CalendarEvent<T>) => void
  deleteEvent: (id: string) => void
}

export interface UseCalendarProps<T> {
  initialView?: CalendarView
  initialDate?: Date
  events?: CalendarEvent<T>[]
}

export interface UseCalendarReturn<T> extends 
CalendarState<T>, CalendarActions<T> {
  days: Date[]
  isToday: (date: Date) => boolean
  isSelected: (date: Date) => boolean
  getEventsForDate: (date: Date) => CalendarEvent<T>[]
  getEventsForWeek: (date: Date) => CalendarEvent<T>[]
}

const generateId = () => {
  const d =
    typeof performance === 'undefined' ? Date.now() : performance.now() * 1000;

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16 + d) % 16 | 0;

    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const days: Date[] = []

  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  const firstDayOfWeek = firstDay.getDay()

  const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDay - i))
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i))
  }

  const lastDayOfWeek = lastDay.getDay()
  const daysToAdd = 6 - lastDayOfWeek
  for (let i = 1; i <= daysToAdd; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth() + 1, i))
  }

  return days
}

const getDaysInWeek = (date: Date) => {
  const day = date.getDay()
  const diff = date.getDate() - day

  const startOfWeek = new Date(date)
  startOfWeek.setDate(diff)

  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(startOfWeek)
    newDate.setDate(startOfWeek.getDate() + i)
    days.push(newDate)
  }

  return days
}


export const useCalendar = <T = {}>({
  initialView = "month",
  initialDate = new Date(),
  events = [],
}: UseCalendarProps<T> = {}): UseCalendarReturn<T> => {
  const [state, setState] = useState<CalendarState<T>>({
    currentDate: initialDate,
    view: initialView,
    events,
  })

  // Memoized days array based on current view and date
  const days = useMemo(() => {
    const { currentDate, view } = state

    switch (view) {
      case "month":
        return getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
      case "week":
        return getDaysInWeek(currentDate)
      case "day":
        return [new Date(currentDate)]
      default:
        return []
    }
  }, [state])

  const isToday = useCallback((date: Date) => {
    const today = new Date()
    return isSameDay(date, today)
  }, [])

  const isSelected = useCallback(
    (date: Date) => {
      return isSameDay(date, state.currentDate)
    },
    [state.currentDate],
  )

  const getEventsForDate = useCallback(
    (date: Date) => {
      return state.events.filter(event => isSameDay(event.date, date))
    },
    [state.events],
  )

  const getEventsForWeek = useCallback(
    (startOfWeek: Date) => {
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return state.events.filter((event) => event.date >= startOfWeek && event.date <= endOfWeek)
    },
    [state.events],
  )

  const setView = useCallback((view: CalendarView) => {
    setState((prev) => ({ ...prev, view }))
  }, [])

  const goToDate = useCallback((date: Date) => {
    setState((prev) => ({ ...prev, currentDate: date }))
  }, [])

  const goToToday = useCallback(() => {
    setState((prev) => ({ ...prev, currentDate: new Date() }))
  }, [])

  const goToPrev = useCallback(() => {
    setState((prev) => {
      const { currentDate, view } = prev
      const newDate = new Date(currentDate)

      switch (view) {
        case "month":
          newDate.setMonth(currentDate.getMonth() - 1)
          break
        case "week":
          newDate.setDate(currentDate.getDate() - 7)
          break
        case "day":
          newDate.setDate(currentDate.getDate() - 1)
          break
      }

      return { ...prev, currentDate: newDate }
    })
  }, [])

  const goToNext = useCallback(() => {
    setState((prev) => {
      const { currentDate, view } = prev
      const newDate = new Date(currentDate)

      switch (view) {
        case "month":
          newDate.setMonth(currentDate.getMonth() + 1)
          break
        case "week":
          newDate.setDate(currentDate.getDate() + 7)
          break
        case "day":
          newDate.setDate(currentDate.getDate() + 1)
          break
      }

      return { ...prev, currentDate: newDate }
    })
  }, [])

  const addEvent = useCallback((event: CalendarEvent<T>) => {
    setState((prev) => ({
      ...prev,
      events: [...prev.events, event],
    }))
  }, [])

  const addEvents = useCallback((newEvents: CalendarEvent<T>[]) => {
    setState((prev) => ({
      ...prev,
      events: [...prev.events, ...newEvents],
    }))
  }, [])

  const updateEvent = useCallback((event: CalendarEvent<T>) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === event.id ? event : e)),
    }))
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }))
  }, [])

  return {
    ...state,
    days,
    isToday,
    isSelected,
    getEventsForDate,
    getEventsForWeek,
    setView,
    goToDate,
    goToToday,
    goToPrev,
    goToNext,
    addEvent,
    addEvents,
    updateEvent,
    deleteEvent,
  }
}
