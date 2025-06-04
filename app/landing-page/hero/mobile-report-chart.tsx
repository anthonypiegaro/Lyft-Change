"use client"

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Strength", score: 75, standard: 100 },
  { category: "Power", score: 65, standard: 100 },
  { category: "Speed", score: 51, standard: 100 },
  { category: "Mobility", score: 43, standard: 100 },
  { category: "Endurance", score: 45, standard: 100 }
]

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--color-chart-6)",
  },
  standard: {}
} satisfies ChartConfig

export function MobileReportCard() {
  return (
    <Card className="px-0 w-full">
      <CardHeader>
        <CardTitle>Example Athlete Report</CardTitle>
        <CardDescription>
          Athlete's Overall Physical Fitness Report
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 px-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="standard"
              fill="transparent"
              stroke="none"
              fillOpacity={0}
              strokeOpacity={0}
              isAnimationActive={false}
            />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex">
        <p>Overall fitness up 15%</p>
        <TrendingUp className="ml-1 w-4 h-4"/>
      </CardFooter>
    </Card>
  )
}
