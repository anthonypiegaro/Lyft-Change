"use client"

import React, { useEffect, useState } from "react"
import { Pencil, PencilOff, Trash } from "lucide-react" 

import { CalendarEvent } from "@/components/calendar/use-calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { WorkoutEvent } from "./calendar"

export function DailyEventsDialog({
  open,
  onOpenChange,
  date,
  events,
  onEventClick,
  onDeleteClick
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string
  events: CalendarEvent<WorkoutEvent>[]
  onEventClick: (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => void
  onDeleteClick: (event: CalendarEvent<WorkoutEvent>, e: React.MouseEvent) => void
}) {
  const [inEditMode, setInEditMode] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {date}
          </DialogTitle>
          <DialogDescription>
            All workouts for {date}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 max-h-120 overflow-auto">
          {events.map(event => (
            <div
              key={event.id}
              className="flex justify-between items-center px-1 py-0.5 min-h-10 text-xs rounded-xl bg-zinc-400/80 hover:bg-zinc-400 cursor-pointer"
              onClick={(e) => onEventClick(event, e)}
            >
              <p className="font-medium text-base truncate">{event.name}</p>
              <Button 
                variant="ghost" 
                className={cn("h-auto w-auto min-w-0 min-h-0 cursor-pointer", !inEditMode && "hidden")}
                onClick={e => onDeleteClick(event, e)}
              >
                <Trash className="text-destructive w-1 h-1" />
              </Button>
            </div>
          ))}
        </div>
        <div className="ml-auto">
          <Button onClick={() => setInEditMode(prev => !prev)}>
            {inEditMode ? <PencilOff className="w-4 h-4" /> : <Pencil className="w-4 h-4"/>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}