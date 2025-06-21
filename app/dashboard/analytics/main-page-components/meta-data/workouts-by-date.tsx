"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Bar, BarChart, LabelList, XAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const shortMonthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export type MetaDataWorkout = {
  date: Date
}

export type ChartData = {
  count: 0,
  date: string
}[]

export function WorkoutsByDate({
  workouts
}: {
  workouts: MetaDataWorkout[]
}) {
  const [freq, setFreq] = useState<"week" | "month">("week")
  const [date, setDate] = useState<Date>(new Date())

  const isMobile = useIsMobile()

  const createWeekBucket = () => {
    const currentDay = date.getDay()
    const firstDayOfLastWeek = new Date(date)
    firstDayOfLastWeek.setDate(firstDayOfLastWeek.getDate() - currentDay)
    const firstDayOfFirstWeek = new Date(firstDayOfLastWeek)
    firstDayOfFirstWeek.setDate(firstDayOfFirstWeek.getDate() - 28)

    const dateSetter = new Date(firstDayOfFirstWeek)

    const timeBucket: ChartData = []
    const pad = (n: number) => n.toString().padStart(2, "0")

    for (let i = 0; i < 5; i++) {
      const formattedDate = `${pad(dateSetter.getMonth() + 1)}/${pad(dateSetter.getDate())}`
  
      timeBucket.push({
        count: 0,
        date: formattedDate
      })

      dateSetter.setDate(dateSetter.getDate() + 7)
    }

    const lowerBoundry = new Date(
      firstDayOfFirstWeek.getFullYear(),
      firstDayOfFirstWeek.getMonth(),
      firstDayOfFirstWeek.getDate()
    )

    for (const workout of workouts) {
      const bucket = Math.floor((workout.date.getTime() - lowerBoundry.getTime()) / 304_800_000)

      if (bucket >= 0 && bucket <= 4) {
        timeBucket[bucket].count++
      }
    }

    return timeBucket
  }

  const createMonthBucket = () => {
    const firstMonth = new Date(date.getFullYear(), date.getMonth() - 4, 1)
    const firstDayAfterLastMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    const dateSetter = new Date(firstMonth)

    const timeBucket: ChartData = []

    for (let i = 0; i < 5; i++) {
      timeBucket.push({
        count: 0,
        date: shortMonthNames[dateSetter.getMonth()]
      })

      dateSetter.setMonth(dateSetter.getMonth() + 1)
    }

    for (const workout of workouts) {
      if (firstMonth <= workout.date && workout.date < firstDayAfterLastMonth) {
        let month = workout.date.getMonth()

        if (month < firstMonth.getMonth()) {
          month += 12
        }

        timeBucket[month - firstMonth.getMonth()].count++
      }
    }

    return timeBucket
  }

  const goToPreviousDate = () => {
    const newDate = new Date(date)

    if (freq === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }

    setDate(newDate)
  }

  const goToNextDate = () => {
    const newDate = new Date(date)

    if (freq === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }

    setDate(newDate)
  }

  const chartData: ChartData = useMemo(() => {
    return freq === "week" ? createWeekBucket() : createMonthBucket()
  }, [workouts, freq, date])

  const chartConfig = {
    count: {
      label: "Workouts",
      color: ("var(--color-chart-6)")
    }
  } satisfies ChartConfig

  return (
    <div className="w-full">
      <div className="w-full flex border-b divide-x">
        <div className="flex-1 py-2 px-2 flex items-center text-sm">
          <p className="text-muted-foreground">Number of workouts by {freq}</p>
        </div>
        <div 
          className={cn(
            "flex jusify-center items-center px-3 font-medium transition-all hover:bg-muted/20 cursor-pointer", 
            freq === "week" && "bg-muted/50 hover:bg-muted/50"
          )}
          onClick={() => setFreq("week")}
        >
          Week
        </div>
        <div
          className={cn(
            "flex jusify-center items-center px-3 py-3 font-medium transition-all hover:bg-muted/20 cursor-pointer", 
            freq === "month" && "bg-muted/50 hover:bg-muted/50"
          )}
          onClick={() => setFreq("month")}
        >
          Month
        </div>
      </div>
      <div className="relative h-full">
        <Button 
          variant="ghost" 
          onClick={goToPreviousDate}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        >
          <ChevronLeft />
        </Button>
        <Button 
          variant="ghost" 
          onClick={goToNextDate}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <ChevronRight />
        </Button>
        <ChartContainer config={chartConfig} className="min-h-0 w-full px-10 py-10">
          <BarChart data={chartData} margin={{ top: isMobile ? 20 : 24 }}>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
            <Bar dataKey="count" fill="var(--color-count)" radius={isMobile ? 10 : 22}>
              <LabelList 
                dataKey="count" 
                position="top" 
                fontSize={isMobile ? 12 : 16} 
                className="fill-foreground" 
                offset={isMobile ? 10 : 12} 
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}