"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

import { WeightRepsExerciseData } from "./page"

export function WeightRepsPage({
  exerciseData
}: {
  exerciseData: WeightRepsExerciseData
}) {
  const [intensityOn, setIntensityOn] = useState(true)
  const [volumeOn, setVolumeOn] = useState(false)
  const [intensityMeasure, setIntensityMeasure] = useState<"actual" | "estimated">("actual")
  const [volumeMeasure, setVolumeMeasure] = useState<"set volume" | "volume load">("set volume")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDates)
  const [interval, setInterval] = useState<"day" | "week" | "month">("week")

  return (
    <div className="container mx-auto">
      <Card className="p-0 gap-0 m-0">
        <div className="py-2 px-2 border-b">
          <p className="text-sm text-muted-foreground">interactive chart</p>
        </div>
        <div className="flex divide-x border-b">
          <h2 className="flex-1 px-2 md:px-3 lg:px-4 xl:px-6 text-3xl font-semibold py-2 md:py-4 lg:py-6 xl:py-8 truncate">{exerciseData.name}</h2>
          <button 
            className={cn(
              "font-medium px-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 md:px-4 lg:px-6 xl:px-8",
              intensityOn && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setIntensityOn(prev => !prev)}
          >
            Intensity
          </button>
          <button 
            className={cn(
              "font-medium px-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 md:px-4 lg:px-6 xl:px-8",
              volumeOn && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setVolumeOn(prev => !prev)}
          >
            Volume
          </button>
        </div>
        <div className="flex justify-end divide-x border-b">
          {intensityOn && (
            <>
            <button 
              className={cn(
                "font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 border-l shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
                intensityMeasure === "actual" && "bg-muted/60 hover:bg-muted/60"
              )}
              onClick={() => setIntensityMeasure("actual")}
            >
              Max Weight
            </button>
            <button 
              className={cn(
                "font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
                intensityMeasure === "estimated" && "bg-muted/60 hover:bg-muted/60"
              )}
              onClick={() => setIntensityMeasure("estimated")}
            >
              Est. 1RM
            </button>
            </>
          )}
          {volumeOn && (
            <>
            <button 
              className={cn(
                "font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
                volumeMeasure === "set volume" && "bg-muted/60 hover:bg-muted/60",
                !intensityOn && "border-l"
              )}
              onClick={() => setVolumeMeasure("set volume")}
            >
              Set Volume
            </button>
            <button 
              className={cn(
                "font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
                volumeMeasure === "volume load" && "bg-muted/60 hover:bg-muted/60"
              )}
              onClick={() => setVolumeMeasure("volume load")}
            >
              Volume Load
            </button>
            </>
          )}
        </div>
        <div className="flex justify-between py-4 px-2 md:px-6 lg:px-8 xl:px-10">
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          <Select defaultValue={interval} onValueChange={v => setInterval(v as "day" | "week" | "month")}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  )
}

const getInitialDates = () => {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return {
    from: lastMonth,
    to: today
  };
};

function DateRangePicker({
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
