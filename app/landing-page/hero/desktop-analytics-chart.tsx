"use client"

import { 
  CartesianGrid, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis
} from "recharts"

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
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", strength: 55, power: 48, speed: 60, endurance: 58, mobility: 70 },
  { month: "Feb", strength: 57, power: 50, speed: 62, endurance: 60, mobility: 71 },
  { month: "Mar", strength: 60, power: 53, speed: 65, endurance: 63, mobility: 72 },
  { month: "Apr", strength: 64, power: 57, speed: 67, endurance: 67, mobility: 73 },
  { month: "May", strength: 69, power: 62, speed: 68, endurance: 72, mobility: 74 },
  { month: "Jun", strength: 73, power: 62, speed: 66, endurance: 74, mobility: 72 },
  { month: "Jul", strength: 78, power: 65, speed: 68, endurance: 77, mobility: 73 },
  { month: "Aug", strength: 82, power: 70, speed: 72, endurance: 82, mobility: 75 },
  { month: "Sep", strength: 85, power: 76, speed: 75, endurance: 86, mobility: 77 },
  { month: "Oct", strength: 83, power: 80, speed: 75, endurance: 84, mobility: 79 },
  { month: "Nov", strength: 88, power: 85, speed: 78, endurance: 89, mobility: 81 },
  { month: "Dec", strength: 92, power: 90, speed: 80, endurance: 95, mobility: 83 },
]

const chartConfig = {
  strength: {
    label: "strength",
    color: "var(--color-chart-6)"
  },
  power: {
    label: "power",
    color: "var(--color-chart-7)"
  },
  speed: {
    label: "speed",
    color: "var(--color-chart-8)"
  },
  endurance: {
    label: "endurance",
    color: "var(--color-chart-9)"
  },
  mobility: {
    label: "mobility",
    color: "var(--color-chart-10)"
  }
} satisfies ChartConfig

export function DesktopAnalyticsChart() {
  return (
    <Card className="w-full h-full gap-0">
      <CardHeader>
        <CardTitle className="text-base">Fitness Over Time</CardTitle>
        <CardDescription className="text-sm">
          Progression of five key fitness attributes—strength, speed, power, endurance, and mobility—measured over a period of time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full pb-2">
          <LineChart data={chartData}>
            <CartesianGrid />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis dataKey="month" />
            <YAxis domain={[45, 100]} axisLine={false} tick={false} width={0}/>
            <Line dataKey="strength" stroke="var(--color-strength)" dot={false} strokeWidth={3} type="natural" />
            <Line dataKey="power" stroke="var(--color-power)" dot={false} strokeWidth={3} type="natural" />
            <Line dataKey="speed" stroke="var(--color-speed)" dot={false} strokeWidth={3} type="natural" />
            <Line dataKey="endurance" stroke="var(--color-endurance)" dot={false} strokeWidth={3} type="natural" />
            <Line dataKey="mobility" stroke="var(--color-mobility)" dot={false} strokeWidth={3} type="natural" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
