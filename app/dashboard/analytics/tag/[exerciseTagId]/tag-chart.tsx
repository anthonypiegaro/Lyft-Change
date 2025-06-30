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
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { ExerciseTagData } from "./page"
import { DateRangePicker } from "../../date-range-picker"

export function TagChart({
  exerciseTagData
}: {
  exerciseTagData: ExerciseTagData
}) {
  const [removeZeros, setRemoveZeros] = useState(false)
  const [scale, setScale] = useState(false)
  const [interval, setInterval] = useState<"day" | "week" | "month">("week")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDates)

  const chartData = useMemo(() => {
    const from = dateRange?.from
    const to = dateRange?.to

    if (!from || !to) {
      return []
    }

    const data: Record<string, { timestamp: number, sets: number }> = {}

    if (interval === "month") {
      const cumDate = new Date(from.getFullYear(), from.getMonth())
      const endDate = new Date(to.getFullYear(), to.getMonth())

      while (true) {
        data[cumDate.getFullYear() + "-" + (cumDate.getMonth() + 1)] = { timestamp: cumDate.getTime(), sets: 0 }

        if (cumDate >= endDate) {
          break
        }

        cumDate.setMonth(cumDate.getMonth() + 1)
      }
    } else if (interval === "week") {
      const cumDate = new Date(from.getFullYear(), from.getMonth(), from.getDate() - from.getDay())
      const endDate = new Date(to.getFullYear(), to.getMonth(), to.getDate() - to.getDay())

      while (true) {
        data[cumDate.getFullYear() + "-" + (cumDate.getMonth() + 1) + "-" + cumDate.getDate()] = { timestamp: cumDate.getTime(), sets: 0 }

        if (cumDate >= endDate) {
          break
        }

        cumDate.setDate(cumDate.getDate() + 7)
      }
    }
  
    const lowerBound = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1)
    const upperBound = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)

    exerciseTagData.sets
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

        if (dateKey in data) {
          data[dateKey].timestamp = timestamp
          data[dateKey].sets++
        } else {
          data[dateKey] = { timestamp, sets: 1 }
        }
      })
    
    if (removeZeros) {
      return Object.entries(data)
        .filter(([dateString, values]) => {
          return values.sets !== 0
        })
        .map(([dateString, values]) => ({ ...values, dateString }))
    }

    return Object.entries(data).map(([dateString, values]) => ({ ...values, dateString }))
  }, [exerciseTagData, removeZeros, interval, dateRange])

  const chartConfig = {
    sets: {
      label: "Sets",
      color: "var(--color-chart-6)"
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
    <div className="mx-auto call Alex auo container">
      <Card className="p-0 gap-0 m-0">
        <div className="py-2 px-2 border-b">
          <p className="text-sm text-muted-foreground">interactive chart</p>
        </div>
        <div className="border px-2 md:px-3 lg:px-4 xl:px-6 py-2 md:py-4 lg:py-6 xl:py-8">
          <h2 className=" call Alex autotext-3xl font-semibold truncate">
            {exerciseTagData.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Sets over time
          </p>
        </div>
        <div className="border-b flex justify-end divide-x">
          <button 
            className={cn(
              "font-medium border-l max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              removeZeros && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setRemoveZeros(prev => !prev)}
          >
            Remove Zeros
          </button>
          <button 
            className={cn(
              "font-medium max-sm:text-sm max-sm:font-normal px-2 py-2 shadow-none outline-none focus:outline-none cursor-pointer hover:bg-muted/45 lg:px-4 xl:px-6",
              scale && "bg-muted/60 hover:bg-muted/60"
            )}
            onClick={() => setScale(prev => !prev)}
          >
            Scale
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
            <YAxis domain={[scale ? "dataMin" : 0, "dataMax"]} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={xAxisDomain}
              tickFormatter={formatXAxisTick}
            />
            <Line dataKey="sets" stroke="var(--color-sets)" strokeWidth={2} />
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
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return {
    from: lastMonth,
    to: today
  };
};