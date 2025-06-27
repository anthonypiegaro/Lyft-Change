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
import { gramsToKilograms, gramsToOunces, gramsToPounds } from "@/lib/unit-conversions"
import { cn } from "@/lib/utils"

import { WeightRepsExerciseData } from "./page"
import { DateRangePicker } from "./date-range-picker"

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
  const [interval, setInterval] = useState<"day" | "week" | "month">("day")
  const [removeZeros, setRemoveZeros] = useState(false)
  const [unit, setUnit] = useState<"g" | "oz" | "lb" | "kg">("lb")

  const chartData = useMemo(() => {
    const from = dateRange?.from
    const to = dateRange?.to

    if (!from || !to) {
      return []
    }

    const data: Record<string, { timestamp: number, weight: number, volume: number}> = {}

    if (interval === "month") {
      const cumDate = new Date(from.getFullYear(), from.getMonth())
      const endDate = new Date(to.getFullYear(), to.getMonth())

      while (true) {
        data[cumDate.getFullYear() + "-" + (cumDate.getMonth() + 1)] = { timestamp: cumDate.getTime(), weight: 0, volume: 0}

        if (cumDate >= endDate) {
          break
        }

        cumDate.setMonth(cumDate.getMonth() + 1)
      }
    } else if (interval === "week") {
      const cumDate = new Date(from.getFullYear(), from.getMonth(), from.getDate() - from.getDay())
      const endDate = new Date(to.getFullYear(), to.getMonth(), to.getDate() - to.getDay())

      while (true) {
        data[cumDate.getFullYear() + "-" + (cumDate.getMonth() + 1) + "-" + cumDate.getDate()] = { timestamp: cumDate.getTime(), weight: 0, volume: 0 }

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
        let setWeight = set.weight
  
        if (unit === "oz") {
          setWeight = gramsToOunces(setWeight)
        } else if (unit === "lb") {
          setWeight = gramsToPounds(setWeight)
        } else if (unit === "kg") {
          setWeight = gramsToKilograms(setWeight)
        }
    
        // using Epley formula for the estimated 1rm
        const weight = intensityMeasure === "estimated" ? Math.round((setWeight * (1 + 0.0333 * set.reps)) * 100) / 100 : (setWeight % 1 != 0) ? Math.round(setWeight * 100) / 100 : setWeight

        const volume = volumeMeasure === "volume load" ? setWeight * set.reps : 1

        if (dateKey in data) {
          data[dateKey].weight = Math.max(data[dateKey].weight, weight)
          data[dateKey].volume = Math.round(data[dateKey].volume + volume)
        } else {
          data[dateKey] = { timestamp, weight, volume }
        }
      })

    if (removeZeros) {
      return Object.entries(data)
        .filter(([dateString, values]) => {
          if (values.weight === 0) {
            return false
          }

          if (volumeOn && values.volume === 0) {
            return false
          }

          return true
        })
        .map(([dateString, values]) => ({ ...values, dateString }))
    }

    return Object.entries(data).map(([dateString, values]) => ({ ...values, dateString }))
  }, [exerciseData, intensityMeasure, volumeMeasure, dateRange, interval, removeZeros, unit])


  const chartConfig = {
    weight: {
      label: `weight (${unit})`,
      color: "var(--color-chart-6)"
    },
    volume: {
      label: volumeMeasure === "set volume" ? "sets" : `load (${unit})`,
      color: "var(--color-chart-7)"
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
      <Card className="p-0 gap-0 m-0">
        <div className="py-2 px-2 border-b">
          <p className="text-sm text-muted-foreground">interactive chart</p>
        </div>
        <div className="flex flex-wrap divide-x border-b">
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
          <Select defaultValue={unit} onValueChange={v => setUnit(v as "g" | "oz" | "lb" | "kg")}>
            <SelectTrigger className="w-18">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="oz">oz</SelectItem>
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
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
            <YAxis yAxisId="weight" domain={["dataMin", "dataMax"]} />
            <YAxis yAxisId="volume" domain={["dataMin", "dataMax"]} orientation="right"/>
            <XAxis 
              dataKey="timestamp" 
              type="number" 
              domain={xAxisDomain} 
              tickFormatter={formatXAxisTick}
              tickCount={chartData.length}
              minTickGap={10}
            />
            {intensityOn && <Line yAxisId="weight" dataKey="weight" stroke="var(--color-weight)" />}
            {volumeOn && <Line yAxisId="volume" dataKey="volume" stroke="var(--color-volume" />}
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
