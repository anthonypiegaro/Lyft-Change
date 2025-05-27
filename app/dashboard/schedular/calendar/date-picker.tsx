"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
    selected,
    onSelect
}: {
    selected: Date,
    onSelect: (date: Date) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
        >
          <CalendarIcon className="w-5 h-5 text-muted-foreground"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date === undefined ? onSelect(new Date()) : onSelect(date)}
        />
      </PopoverContent>
    </Popover>
  )
}
