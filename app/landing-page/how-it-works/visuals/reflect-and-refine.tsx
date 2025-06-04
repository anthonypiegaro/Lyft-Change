"use client"

import { useState } from "react"
import { 
  CartesianGrid, 
  LineChart,
  Line,
  XAxis,
  YAxis
} from "recharts"

import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const chartData = [
  { week: 0, batSpeed: 75.0, smashFactor: 35, approach: 48 },
  { week: 1, batSpeed: 75.2, smashFactor: 38, approach: 48.5 },
  { week: 2, batSpeed: 75.1, smashFactor: 40, approach: 49 },
  { week: 3, batSpeed: 75.3, smashFactor: 42, approach: 49.2 },
  { week: 4, batSpeed: 75.5, smashFactor: 44, approach: 49.5 },
  { week: 5, batSpeed: 75.4, smashFactor: 46, approach: 50 },
  { week: 6, batSpeed: 75.6, smashFactor: 48, approach: 50.5 },
  { week: 7, batSpeed: 75.7, smashFactor: 50, approach: 51 },
  { week: 8, batSpeed: 75.5, smashFactor: 53, approach: 51.5 },
  { week: 9, batSpeed: 75.8, smashFactor: 56, approach: 52 },
  { week: 10, batSpeed: 75.7, smashFactor: 59, approach: 53 },
  { week: 11, batSpeed: 75.9, smashFactor: 62, approach: 54 },
  { week: 12, batSpeed: 76.0, smashFactor: 65, approach: 55 },
];

const chartConfig = {
  batSpeed: {
    label: "Bat Speed",
    color: "var(--color-chart-6)"
  },
  smashFactor: {
    label: "Smash Factor",
    color: "var(--color-chart-7)"
  },
  approach: {
    label: "Approach",
    color: "var(--color-chart-8)"
  }
} satisfies ChartConfig

export function ReflectAndRefine() {
  const [batSpeedActive, setBatSpeedActive] = useState(true)
  const [smashFactorActive, setSmashFactorActive] = useState(true)
  const [approachActive, setApproachActive] = useState(true)

  const isMobile = useIsMobile()

  const min = smashFactorActive ? 35 : approachActive ? 48 : 74
  const max = batSpeedActive ? 80 : smashFactorActive ? 70 : 60

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-4">
          <CardTitle>Hitting Big 3 Progress</CardTitle>
          <CardDescription>
            12 week progression of Bat Speed, Smash Factor, and Approach
          </CardDescription>
        </div>
        <div className="flex items-center gap-x-2">
          <Badge 
            variant={batSpeedActive ? "default" : "outline"} 
            className={cn(
              "cursor-pointer transition-all hover:bg-primary/90", 
              batSpeedActive && "hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50"
            )}
            onClick={() => setBatSpeedActive(prev => !prev)}
          >
            Bat Speed
          </Badge>
          <Badge 
            variant={smashFactorActive ? "default" : "outline"} 
            className={cn(
              "cursor-pointer transition-all hover:bg-primary/90", 
              smashFactorActive && "hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50"
            )}
            onClick={() => setSmashFactorActive(prev => !prev)}
          >
            Smash Factor
          </Badge>
          <Badge 
            variant={approachActive ? "default" : "outline"} 
            className={cn(
              "cursor-pointer transition-all hover:bg-primary/90", 
              approachActive && "hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50"
            )}
            onClick={() => setApproachActive(prev => !prev)}
          >
            Approach
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-0">
          <LineChart data={chartData}>
            <CartesianGrid />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis dataKey="week" tickMargin={10} />
            <YAxis allowDecimals={false} hide={isMobile} tickMargin={10} domain={[min, max]}/>
            {batSpeedActive && <Line dataKey="batSpeed" stroke="var(--color-batSpeed)" strokeWidth={4} dot={{ r: 2 }} />}
            {smashFactorActive && <Line dataKey="smashFactor" stroke="var(--color-smashFactor)" strokeWidth={4} dot={{ r: 2 }} />}
            {approachActive && <Line dataKey="approach" stroke="var(--color-approach)" strokeWidth={4} dot={{ r: 2 }} />}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}