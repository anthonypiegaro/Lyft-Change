"use client"

import { useState } from "react"
import {
  BookText,
  ChevronLeft, 
  ChevronRight,
  Dumbbell,
  Pencil, 
  PencilOff, 
  Plus 
} from "lucide-react"
import { toast } from "sonner"

import { CalendarEvent, CalendarView, useCalendar } from "@/components/calendar/use-calendar"
import { Button } from "@/components/ui/button"

import { DatePicker } from "./date-picker"
import { DayView } from "./day-view"
import { WeekView } from "./week-view"
import { MonthView } from "./month-view"
import { AddWorkoutForm } from "./add-workout-form"
import { addWorkouts } from "./add-workouts.action"
import { DeleteEventConfirmation } from "./delete-event-confirmation"
import { deleteWorkout } from "./delete-workout.action"
import { AddProgramForm } from "./add-program-form"

export type WorkoutEvent = {
  id: string
  name: string
  date: Date
}

export type Tag = {
  value: string,
  label: string
}

export type WorkoutTemplate = {
  id: string
  name: string
  tags: Tag[]
}

export type ProgramTag = {
  id: string
  name: string
}

export type Program = {
  id: string,
  name: string
  tags: ProgramTag[]
}

export function Calendar({
  events = [],
  initialView = "month",
  initialDate = new Date(),
  onEventClick,
  onDateClick,
  onAddEvent,
  workoutTemplates,
  tags,
  programs,
  programTags
}: {
  events?: CalendarEvent<WorkoutEvent>[]
  initialView?: CalendarView
  initialDate?: Date
  onEventClick?: (event: CalendarEvent<WorkoutEvent>) => void
  onDateClick?: (date: Date) => void
  onAddEvent?: (event: CalendarEvent<WorkoutEvent> | CalendarEvent<WorkoutEvent>[]) => void
  workoutTemplates: WorkoutTemplate[]
  tags: Tag[]
  programs: Program[]
  programTags: ProgramTag[]
}) {
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false)
  const [showAddProgramForm, setShowAddProgramForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inEditMode, setInEditMode] = useState(false)
  const [showDeleteWorkoutForm, setShowDeleteWorkoutForm] = useState(false)
  const [workoutToDeleteId, setWorkoutToDeleteId] = useState("")
  const [workoutToDeleteName, setWorkoutToDeleteName] = useState("")

  const calendar = useCalendar<WorkoutEvent>({
    initialView,
    initialDate,
    events
  })

  const handleEventClick = (event: CalendarEvent<WorkoutEvent>) => {
    onEventClick?.(event)
  }

  const handleAddWorkoutClick = () => {
    setShowAddWorkoutForm(true)
  }

  const handleAddProgramClick = () => {
    setShowAddProgramForm(true)
  }

  const handleEditClick = () => {
    setInEditMode(prev => !prev)
  }

  const handleAddWorkoutSubmit = async (workoutTemplateIds: string[], date: Date) => {
    setIsSubmitting(true)

    await addWorkouts({ workoutTemplateIds, date })
      .then(data  => {
        setShowAddWorkoutForm(false)

        calendar.addEvents(data)

        toast.success("Success", {
          description: "Workouts have been added"
        })
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })

    setIsSubmitting(false)
  }

  const handleDeleteWorkout = async (workoutInstanceId: string) => {
    setIsSubmitting(true)

    await deleteWorkout(workoutInstanceId)
      .then(() => {
        calendar.deleteEvent(workoutInstanceId)
        toast.success("Success", {
          description: "Workout has been deleted successfully"
        })
        setShowDeleteWorkoutForm(false)
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })

    setIsSubmitting(false)
  }

  const handleDeleteClick = (workoutId: string, name: string) => {
    setWorkoutToDeleteId(workoutId)
    setWorkoutToDeleteName(name)
    setShowDeleteWorkoutForm(true)
  }

  const renderView = () => {
    switch (calendar.view) {
      case "month":
        return <MonthView calendar={calendar} onEventClick={handleEventClick} inEditMode={inEditMode} onDeleteClick={handleDeleteClick} />
      case "week":
        return <WeekView calendar={calendar} onEventClick={handleEventClick} inEditMode={inEditMode} onDeleteClick={handleDeleteClick}/>
      case "day":
        return <DayView calendar={calendar} onEventClick={handleEventClick} inEditMode={inEditMode} onDeleteClick={handleDeleteClick}/>
      default:
        return null
    }
  }

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {}

    switch (calendar.view) {
      case "month":
        options.month = "long"
        options.year = "numeric"
        break
      case "week":
        const startOfWeek = calendar.days[0]
        const endOfWeek = calendar.days[6]

        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.toLocaleDateString("en-US", { month: "long" })} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`
        } else {
          return `${startOfWeek.toLocaleDateString("en-US", { month: "short" })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleDateString("en-US", { month: "short" })} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`
        }
      case "day":
        options.weekday = "long"
        options.month = "long"
        options.day = "numeric"
        options.year = "numeric"
        break
    }

    return calendar.currentDate.toLocaleDateString("en-US", options)
  }

  return (
    <div className="container max-md:w-full mx-auto flex flex-col border rounded-lg shadow-sm bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <DatePicker selected={calendar.currentDate} onSelect={calendar.goToDate} />
          <h2 className="text-lg font-semibold">{formatDate()}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={calendar.goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={calendar.goToPrev}>
            <ChevronLeft className="w-4 h-4"/>
          </Button>
          <Button variant="outline" size="icon" onClick={calendar.goToNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex space-x-1">
          <Button 
            variant={calendar.view === "month" ? "default" : "ghost"} 
            onClick={() => calendar.setView("month")}
          >
            Month
          </Button>
          <Button
            variant={calendar.view === "week" ? "default" : "ghost"}
            onClick={() => calendar.setView("week")}
          >
            Week
          </Button>
          <Button
            variant={calendar.view === "day" ? "default" : "ghost"}
            onClick={() => calendar.setView("day")}
          >
            Day
          </Button>
        </div>

        <div className="flex gap-x-1">
          <Button onClick={handleEditClick} className="max-md:hidden">
            {inEditMode ? <PencilOff className="w-4 h-4" /> : <Pencil className="w-4 h-4"/>}
          </Button>
          <Button onClick={handleAddWorkoutClick}>
            <Plus className="w-4 h-4 sm:mr-1" />
            <Dumbbell className="w-4 h-4 sm:hidden" />
            <p className="max-sm:hidden">Add Workout</p>
          </Button>
          <Button onClick={handleAddProgramClick}>
            <Plus className="w-4 h-4 sm:mr-1" />
            <BookText className="w-4 h-4 sm:hidden" />
            <p className="max-sm:hidden">Add Program</p>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">{renderView()}</div>
      <AddWorkoutForm 
        workoutTemplates={workoutTemplates} 
        tags={tags} 
        open={showAddWorkoutForm} 
        onOpenChange={setShowAddWorkoutForm}
        onAdd={handleAddWorkoutSubmit}
        disabled={isSubmitting}
      />
      <AddProgramForm 
        open={showAddProgramForm}
        onOpenChange={setShowAddProgramForm}
        programs={programs}
        programTags={programTags}
        calendar={calendar}
      />
      <DeleteEventConfirmation 
        isOpen={showDeleteWorkoutForm} 
        onOpenChange={setShowDeleteWorkoutForm}
        isSubmitting={isSubmitting}
        workoutName={workoutToDeleteName}
        workoutId={workoutToDeleteId}
        onDelete={handleDeleteWorkout}
      />
    </div>
  )
}
