"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Calendar, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ProgramCalendar({
  weeks,
  onAddWeek,
  maxHeight
}: {
  weeks: number
  onAddWeek: () => void
  maxHeight: number
}) {
  const headerRef = useRef<HTMLDivElement>(null)
  const daysRef = useRef<HTMLDivElement>(null)
  const [calendarMaxHeight, setCalendarMaxHeight] = useState(0)

  useLayoutEffect(() => {
    if (headerRef.current) {
      setCalendarMaxHeight(maxHeight - headerRef.current.offsetHeight - 24 - 8);
    }
  }, [maxHeight])

  useLayoutEffect(() => {
    if (daysRef.current) {
      daysRef.current.scrollTo({
        top: daysRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [weeks]);

  return (
    <Card className="max-h-full py-[12px]">
      <CardContent className="max-h-full py-0 my-0">
        <div ref={headerRef} className="mb-[8px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-2">
              <Calendar className="w-4.1 h-4.1" />
              <h2 className="text-xl font-normal">Program Calendar</h2>
            </div>
            <Button onClick={onAddWeek}>
              <Plus /> Add Week
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mb-0">Your program schedule - drag workouts from the library to get started</p>
        </div>
        <div className="grid grid-cols-7 gap-3 pb-1 overflow-auto" style={{ maxHeight: calendarMaxHeight }} ref={daysRef}>
          {Array.from({ length: weeks * 7}, (_, i) => {
            return (
              <div key={i} className="flex flex-col items-center h-32 overflow-auto border-2 border-dashed rounded-md">
                <p className="py-1">Day {i}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}