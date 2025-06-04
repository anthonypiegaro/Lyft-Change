"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { 
  ChartConfig, 
  ChartContainer,
  ChartLegend, 
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { metric: "Bat Speed", athlete: 75, goal: 80 },
  { metric: "Smash Factor", athlete: 35, goal: 80 },
  { metric: "Approach", athlete: 48, goal: 80 }
]

const chartConfig = {
  athlete: {
    label: "Athlete",
    color: "var(--color-chart-6)"
  },
  goal: {
    label: "Goal",
    color: "var(--color-chart-7)"
  }
} satisfies ChartConfig

export function AnalyzeAndAssess() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Hitting Assessment</CardTitle>
        <CardDescription>
          Athlete's grade for each of the Big 3 of hitting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <ChartLegend content={<ChartLegendContent />} />
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="metric"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
            <Bar dataKey="athlete" fill="var(--color-athlete)" radius={4} />
            <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}