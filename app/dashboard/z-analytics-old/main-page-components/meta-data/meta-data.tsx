"use client"

import { useState } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { EntitesByDate, MetaDataEntity } from "./entities-by-date"

export function MetaData({
  className,
  workouts,
  exercises
}: {
  className: string
  workouts: MetaDataEntity[]
  exercises: MetaDataEntity[]
}) {
  const [chart, setChart] = useState<"Workouts" | "Exercises">("Workouts")

  return (
    <Card className={cn("w-full gap-0 py-0", className)}>
      <div className="px-2 py-2 text-muted-foreground text-sm">metadata</div>
      <div>
        <div className="flex border-y divide-x">
          <div className="flex-1 px-2 py-3">
            <h2 className="text-3xl font-semibold">{chart}</h2>
            <p className="text-sm text-muted-foreground">Showing frequency trends over time</p>
          </div>
          <div 
            className={cn(
              "flex jusify-center items-center px-5 font-medium transition-all hover:bg-muted/20 cursor-pointer", 
              chart === "Workouts" && "bg-muted/50 hover:bg-muted/50"
            )}
            onClick={() => setChart("Workouts")}
          >
            Workouts
          </div>
          <div 
            className={cn(
              "flex jusify-center items-center px-5 font-medium transition-all hover:bg-muted/20 cursor-pointer", 
              chart === "Exercises" && "bg-muted/50 hover:bg-muted/50"
            )}
            onClick={() => setChart("Exercises")}
          >
            Exercises
          </div>
        </div>
      </div>
      <EntitesByDate entities={chart === "Workouts" ? workouts : exercises} entityName={chart === "Workouts" ? "workouts" : "exercises"} />
    </Card>
  )
}