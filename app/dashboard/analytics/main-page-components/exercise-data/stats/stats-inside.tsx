"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import {
  LabelList,
  Line, 
  LineChart, 
  XAxis, 
  YAxis 
} from "recharts"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from "@/components/ui/drawer"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const getInitialDates = () => {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return {
    from: lastMonth,
    to: today
  };
};

export function StatsInside() {
  const [tab, setTab] = useState<"max" | "volume" | "history" | "min">("max")
  const [range, setRange] = useState<DateRange | undefined>(getInitialDates)

  return (
    <div>
      <div className="flex justify-end divide-x border-b h-10">
        <div 
          className={cn(
            "flex justify-center items-center px-5 py-2 font-medium border-l cursor-pointer hover:bg-muted/20",
            tab === "max" && "bg-muted/50 hover:bg-muted/50"
          )}
          onClick={() => setTab("max")}
        >
          Max
        </div>
        <div
          className={cn(
            "flex justify-center items-center px-5 py-2 font-medium cursor-pointer hover:bg-muted/20",
            tab === "volume" && "bg-muted/50 hover:bg-muted/50"
          )}
          onClick={() => setTab("volume")}
        >
          Volume
        </div>
        <div
          className={cn(
            "flex justify-center items-center px-5 py-2 font-medium cursor-pointer hover:bg-muted/20",
            tab === "history" && "bg-muted/50 hover:bg-muted/50"
          )}
          onClick={() => setTab("history")}
        >
          History
        </div>
      </div>
      <DateRangePicker range={range} setRange={setRange} />
      <div className="">
        {tab === "max" && (
          <MaxStats max={275} unit="lbs" />
        )}
        {tab === "volume" && (
          <>
            <p className="text-muted-foreground">Volume</p>
          </>
        )}
        {tab === "history" && (
          <>
            <p className="text-muted-foreground">History</p>
          </>
        )}
      </div>
    </div>
  )
}

function DateRangePicker({
  range,
  setRange
}: {
  range: DateRange | undefined,
  setRange: (range: DateRange | undefined) => void
}) {
  const isMobile = useIsMobile()

  const setRangeToPrevSixMonths = () => {
    const today = new Date()
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())

    setRange({
      from: sixMonthsAgo,
      to: today
    })
  }

  const setRangeToPrevYear = () => {
    const today = new Date()
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

    setRange({
      from: oneYearAgo,
      to: today
    })
  }

  const setRangeToAllTime = () => {
    const today = new Date()
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())

    setRange({
      from: hundredYearsAgo,
      to: today
    })
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="w-full border-b flex justify-end items-center gap-x-2 font-medium bg-transparent border-l py-2 px-4 m-0 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/40"
          >
            <CalendarIcon className="size-6" />
            {range && range.from && range.to
              ? range.from < new Date('1980-01-01') ? "All Time" : `${range.from?.toLocaleDateString()} - ${range.to?.toLocaleDateString()}`
              : "Pick Date Range"
            }
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Select date range</DrawerTitle>
            <DrawerDescription>Set your date range</DrawerDescription>
          </DrawerHeader>
          <div className="w-full flex justify-center items-center gap-x-4 my-3 px-4">
            <h2 className="flex-1 font-medium">Date Range</h2>
            <Button size="sm" variant="outline" onClick={setRangeToPrevSixMonths}>6m</Button>
            <Button size="sm" variant="outline" onClick={setRangeToPrevYear}>1y</Button>
            <Button size="sm" variant="outline" onClick={setRangeToAllTime}>All Time</Button>
          </div>
          <Calendar 
            mode="range"
            defaultMonth={range && range.from && range.from > new Date('1980-01-01') ? range?.from : range?.to}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div className="flex justify-end divide-x border-b">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-x-2 font-medium bg-transparent border-l py-2 px-4 m-0 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/40"
          >
            <CalendarIcon className="size-6" />
            {range && range.from && range.to
              ? range.from < new Date('1980-01-01') ? "All Time" : `${range.from?.toLocaleDateString()} - ${range.to?.toLocaleDateString()}`
              : "Pick Date Range"
            }
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <div className="xl:hidden w-full flex justify-center items-center gap-x-4 my-3 px-4">
            <h2 className="flex-1 font-medium">Date Range</h2>
            <Button size="sm" variant="outline" onClick={setRangeToPrevSixMonths}>6m</Button>
            <Button size="sm" variant="outline" onClick={setRangeToPrevYear}>1y</Button>
            <Button size="sm" variant="outline" onClick={setRangeToAllTime}>All Time</Button>
          </div>
          <Separator className="xl:hidden" />
          <Calendar 
            mode="range"
            defaultMonth={range && range.from && range.from > new Date('1980-01-01') ? range?.from : range?.to}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <button
        className="max-xl:hidden bg-transparent font-medium py-2 px-5 m-0 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/40"
        onClick={setRangeToPrevSixMonths}
      >
        6m
      </button>
      <button
        className="max-xl:hidden bg-transparent font-medium py-2 px-5 m-0 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/40"
        onClick={setRangeToPrevYear}
      >
        1y
      </button>
      <button
        className="max-xl:hidden bg-transparent font-medium py-2 px-5 m-0 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/40"
        onClick={setRangeToAllTime}
      >
        All Time
      </button>
    </div>
  )
}

function MaxStats({ max, unit }: { max: number, unit: string }) {
  return (
    <div className="p-2">
      <p className="text-muted-foreground">One Rep Max</p>
      <div className="flex gap-x-2">
        <h2 className="text-6xl md:text-8xl leading-none tracking-tighter font-bold p-0">{max}</h2>
        <p className="self-end text-xl font-semibold text-muted-foreground">{unit}</p>
      </div>
    </div>
  )
}
