"use client"

import { useMemo, useState } from "react"
import { parseISO } from "date-fns"
import { DateRange } from "react-day-picker"
import { Line, LineChart, XAxis, YAxis } from "recharts"

import { Card } from "@/components/ui/card"
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  mmToFeet, 
  mmToInches, 
  mmToKilometers, 
  mmToMeters, 
  mmToMiles, 
  mmToYards, 
  msToHours, 
  msToMinutes, 
  msToSeconds 
} from "@/lib/unit-conversions"
import { cn } from "@/lib/utils"

import { TimeDistanceExerciseData } from "./page"
import { DateRangePicker } from "./date-range-picker"

export function TimeDistancePage({
  exerciseData
}: {
  exerciseData: TimeDistanceExerciseData
}) {
  const [timeOn, setTimeOn] = useState(false)
  const [distanceOn, setDistanceOn] = useState(false)
  const [paceOn, setPaceOn] = useState(false)
  const [removeZeros, setRemoveZeros] = useState(false)
  const [scale, setScale] = useState(true)
  const [timeUnit, setTimeUnit] = useState<"ms" |"s" |"m" | "h">("m")
  const [distanceUnit, setDistanceUnit] = useState<"mm" | "m" | "km" | "in" | "ft" | "yd" | "mi">("mi")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDates)
  const [interval, setInterval] = useState<"day" | "week" | "month">("day")

  const isMobile = useIsMobile()
  
  const chartData = useMemo(() => {
    const from = dateRange?.from
    const to = dateRange?.to

    if (!from || !to) {
      return []
    }

    const data: Record<
      string, 
      { 
        timestamp: number, 
        time: number, 
        distance: number,
        pace: number
      }> = {}

    if (interval === "month") {
      const cumDate = new Date(from.getFullYear(), from.getMonth())
      const endDate = new Date(to.getFullYear(), to.getMonth())

      while (true) {
        data[cumDate.getFullYear() + "-" + (cumDate.getMonth() + 1)] = { timestamp: cumDate.getTime(), time: 0, distance: 0, pace: 0 }

        if (cumDate >= endDate) {
          break
        }

        cumDate.setMonth(cumDate.getMonth() + 1)
      }
    } else if (interval === "week") {
      const cumDate = new Date(from.getFullYear(), from.getMonth(), from.getDate() - from.getDay())
      const endDate = new Date(to.getFullYear(), to.getMonth(), to.getDate() - to.getDay())

      while (true) {
        data[cumDate.getFullYear() + "-" + (cumDate.getMonth() + 1) + "-" + cumDate.getDate()] = { timestamp: cumDate.getTime(), time: 0, distance: 0, pace: 0 }

        if (cumDate >= endDate) {
          break
        }

        cumDate.setDate(cumDate.getDate() + 7)
      }
    }

    const lowerBound = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1)
    const upperBound = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)

    exerciseData.sets
      .filter(set => {
        const setDate = parseISO(set.date)

        if (setDate <= lowerBound || setDate >= upperBound) {
          return false
        }

        return true
      })
      .forEach(set => {
        const setDate = parseISO(set.date)
        let dateKey: string
        let timestamp: number

        if (interval === "day") {
          dateKey = setDate.getFullYear() + "-" + (setDate.getMonth() + 1) + "-" + setDate.getDate()
          timestamp = setDate.getTime()
        } else if (interval === "week") {
          const startOfWeek = new Date(setDate.getFullYear(), setDate.getMonth(), setDate.getDate() - setDate.getDay())

          dateKey = startOfWeek.getFullYear() + "-" + (startOfWeek.getMonth() + 1) + "-" + startOfWeek.getDate()
          timestamp = startOfWeek.getTime()
        } else {
          // by month
          dateKey = setDate.getFullYear() + "-" + (setDate.getMonth() + 1)
          const dateForTimestamp = new Date(setDate.getFullYear(), setDate.getMonth(), 0)
          timestamp = dateForTimestamp.getTime()
        }

        // unit conversions
        let time = set.time
        let distance = set.distance

        switch (timeUnit) {
          case "s":
            time = msToSeconds(time)
            break
          case "m":
            time = msToMinutes(time)
            break
          case "h":
            time = msToHours(time)
            break
        }

        switch (distanceUnit) {
          case "in":
            distance = mmToInches(distance)
            break
          case "ft": 
            distance = mmToFeet(distance)
            break
          case "m":
            distance = mmToMeters(distance)
            break
          case "yd":
            distance = mmToYards(distance)
            break
          case "km":
            distance = mmToKilometers(distance)
            break
          case "mi":
            distance = mmToMiles(distance) 
            break
        }

        let pace = 0

        if (time % 1 !== 0) {
          time = Math.round(time * 100) / 100
        }

        if (distance % 1 !== 0) {
          distance = Math.round(distance * 100) / 100
        }

        if (dateKey in data) {
          data[dateKey].time += time
          data[dateKey].distance += distance
          
          if (data[dateKey].distance !== 0) {
            data[dateKey].pace = Math.round((data[dateKey].time / data[dateKey].distance) * 100) / 100
          }

        } else {
          if (distance !== 0) {
            pace = Math.round((time / distance) * 100) / 100
          }
          data[dateKey] = { timestamp, time, distance, pace}
        }
      })

    if (removeZeros) {
      return Object.entries(data)
        .filter(([dateString, values]) => {
          if (timeOn && values.time === 0) {
            return false
          }

          if (distanceOn && values.distance === 0) {
            return false
          }

          if (paceOn && values.pace === 0) {
            return false
          }

          return true
        })
        .map(([dateString, values]) => ({ ...values, dateString }))
    }

    return Object.entries(data).map(([dateString, values]) => ({ ...values, dateString }))
  }, [exerciseData, timeUnit, distanceUnit, dateRange, interval, removeZeros])
  
  const chartConfig = {
    time: {
      label: `time (${timeUnit})`,
      color: "var(--color-chart-6)"
    },
    distance: {
      label: `distance (${distanceUnit})`,
      color: "var(--color-chart-7)"
    },
    pace: {
      label: `pace (${distanceUnit}/${timeUnit})`,
      color: "var(--color-chart-8)"
    }
  } satisfies ChartConfig

  const xAxisDomain = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return ["auto", "auto"]
    }

    if (interval === "day") {
      return [dateRange.from.getTime(), dateRange.to.getTime()]
    } else if  (interval === "week") {
      const lowerBound = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate() - dateRange.from.getDay()).getTime()
      const upperBound = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate() - dateRange.to.getDay()).getTime()

      return [lowerBound, upperBound]
    } else {
      const lowerBound = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 0).getTime()
      const upperBound = new Date(dateRange.to.getFullYear(), dateRange.to.getMonth(), 0).getTime()

      return [lowerBound, upperBound]
    }
  }, [dateRange, interval])

  const formatXAxisTick = (timestamp: number) => {
    const date = new Date(timestamp)

    if (interval === "day") {
      return (date.getMonth() + 1) + "/" + date.getDate() + "/" + (date.getFullYear() % 100)
    } else if (interval === "week") {
      return (date.getMonth() + 1) + "/" + date.getDate() + "/" + (date.getFullYear() % 100)
    } else {
      return (date.getMonth() + 1) + "/" + (date.getFullYear() % 100)
    }
  }

  return (
    <div className="container mx-auto">
      <Card className="p-0 m-0 gap-0">
        <div className="py-2 px-2 border-b">
          <p className="text-sm text-muted-foreground">interactive chart</p>
        </div>
        <div className="flex flex-wrap divide-x border-b">
          <h2 className="flex-1 px-2 md:px-3 lg:px-4 xl:px-6 text-3xl font-semibold py-2 md:py-4 lg:py-6 xl:py-8 truncate">
            {exerciseData.name}
          </h2>
          <button 
            className={cn(
              "font-medium px-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 md:px-4 lg:px-6 xl:px-8",
              timeOn && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setTimeOn(prev => !prev)}
          >
            Time
          </button>
          <button 
            className={cn(
              "font-medium px-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 md:px-4 lg:px-6 xl:px-8",
              distanceOn && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceOn(prev => !prev)}
          >
            Distance
          </button>
          <button 
            className={cn(
              "font-medium px-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 md:px-4 lg:px-6 xl:px-8",
              paceOn && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setPaceOn(prev => !prev)}
          >
            Pace
          </button>
        </div>
        <div className={cn("flex justify-end divide-x border-b", !(timeOn || paceOn) && "hidden")}>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              timeUnit === "ms" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setTimeUnit("ms")}
          >
            ms
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              timeUnit === "s" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setTimeUnit("s")}
          >
            s
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              timeUnit === "m" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setTimeUnit("m")}
          >
            m
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              timeUnit === "h" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setTimeUnit("h")}
          >
            h
          </button>
        </div>
        <div className={cn("flex justify-end divide-x border-b", !(distanceOn || paceOn) && "hidden")}>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "mm" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("mm")}
          >
            mm
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "in" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("in")}
          >
            in
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "ft" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("ft")}
          >
            ft
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "yd" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("yd")}
          >
            yd
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "m" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("m")}
          >
            m
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "km" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("km")}
          >
            km
          </button>
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-5 py-3 md:px-2 md:py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              distanceUnit === "mi" && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setDistanceUnit("mi")}
          >
            mi
          </button>
        </div>
        <div className="flex justify-end divide-x border-b">
          <button 
            className={cn(
              "border-l font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              scale && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setScale(prev => !prev)}
          >
            Scale
          </button>
          <button 
            className={cn(
              "font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              removeZeros && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setRemoveZeros(prev => !prev)}
          >
            Remove Zeros
          </button>
        </div>
        <div className="flex gap-x-1 py-4 px-2 md:px-6 lg:px-8 xl:px-10">
          <div className="flex-1">
            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          </div>
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
        <div className={cn("text-4xl lg:text-5xl xl:6xl flex items-center justify-center font-semibold h-50 lg:h-100 w-full", chartData.length !== 0 && "hidden")}>
          no data
        </div>
        <ChartContainer config={chartConfig} className={cn("h-50 lg:h-100 max-w-full", chartData.length === 0 && "hidden")}>
          <LineChart data={chartData}>
            <YAxis yAxisId="time" domain={[scale ? "dataMin" : 0, "dataMax"]} hide={isMobile}/>
            <YAxis yAxisId="distance" domain={[scale ? "dataMin" : 0, "dataMax"]} orientation="right" hide={isMobile}/>
            <YAxis yAxisId="pace" domain={[scale ? "dataMin" : 0, "dataMax"]} orientation="right" hide={isMobile}/>
            <XAxis 
              dataKey="timestamp" 
              type="number" 
              domain={xAxisDomain} 
              tickFormatter={formatXAxisTick}

            />
            {timeOn && <Line yAxisId="time" dataKey="time" stroke="var(--color-time)" dot={false} strokeWidth={2}/>}
            {distanceOn && <Line yAxisId="distance" dataKey="distance" stroke="var(--color-distance)" dot={false} strokeWidth={2}/>}
            {paceOn && <Line yAxisId="pace" dataKey="pace" stroke="var(--color-pace)" dot={false} strokeWidth={2}/>}
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  labelFormatter={(_, payload) => {
                    const row = payload[0].payload

                    return row.dateString
                  }}
                  indicator="line"
                />
              } 
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  )
}

const getInitialDates = () => {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return {
    from: lastMonth,
    to: today
  }
}