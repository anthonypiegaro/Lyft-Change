"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "./data-table"
import { Workout } from "./columns"
import { WorkoutContext } from "./workout-context"

interface WrapperDataTableProps<TValue> {
  columns: ColumnDef<Workout, TValue>[]
  data: Workout[]
}

export function DataTableWrapper<TValue>({
  columns,
  data
}: WrapperDataTableProps<TValue>) {
  const [stateData, setStateData] = useState(data)

  const deleteWorkout = (workoutId: string) => {
    setStateData(prev => prev.filter(workout => workout.id !== workoutId))
  }

  return (
    <WorkoutContext.Provider value={{ deleteWorkout }}>
      <DataTable columns={columns} data={stateData} />
    </WorkoutContext.Provider>
  )
}