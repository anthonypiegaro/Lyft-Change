"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"

export function DateRangePicker({
  dateRange,
  setDateRange
}: {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}) {
  const [open, setOpen] = useState(false)

  const isMobile = useIsMobile()

  const setRangeToPrevMonth = (months: number) => {
    const today = new Date()
    const past = new Date(today.getFullYear(), today.getMonth() - months, today.getDate())

    setDateRange({
      from: past,
      to: today
    })
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">
            <CalendarIcon/>
            {
              dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : "Select date range"
            }
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-auto overflow-hidden p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Select Range</DrawerTitle>
          </DrawerHeader>
          <Calendar 
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            defaultMonth={dateRange?.from}
            className="mx-auto [--cell-size:clamp(100px,calc(100vw/7.5),100px)]"
          />
          <Separator className="my-2" />
          <div className="max-w-sm mx-auto flex gap-2 justify-center flex-wrap px-4 mb-6">
            <Button variant="outline" onClick={() => {setRangeToPrevMonth(1); setOpen(false)}}>
              1 month
            </Button>
            <Button variant="outline" onClick={() => {setRangeToPrevMonth(3); setOpen(false)}}>
              3 months
            </Button>
            <Button variant="outline" onClick={() => {setRangeToPrevMonth(6); setOpen(false)}}>
              6 months 
            </Button>
            <Button variant="outline" onClick={() => {setRangeToPrevMonth(12); setOpen(false)}}>
              1 year
            </Button>
            <Button variant="outline" onClick={() => {setRangeToPrevMonth(24); setOpen(false)}}>
              2 years
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon/>
          {
            dateRange?.from && dateRange?.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : "Select date range"
          }
          <ChevronDown className="ml-2"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar 
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          defaultMonth={dateRange?.from}
          numberOfMonths={2}
        />
        <Separator className="my-2" />
        <div className="max-w-sm mx-auto flex gap-2 justify-center flex-wrap px-4 mb-2">
          <Button variant="outline" onClick={() => setRangeToPrevMonth(1)}>
            1 month
          </Button>
          <Button variant="outline" onClick={() => setRangeToPrevMonth(3)}>
            3 months
          </Button>
          <Button variant="outline" onClick={() => setRangeToPrevMonth(6)}>
            6 months 
          </Button>
          <Button variant="outline" onClick={() => setRangeToPrevMonth(12)}>
            1 year
          </Button>
          <Button variant="outline" onClick={() => setRangeToPrevMonth(24)}>
            2 years
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
