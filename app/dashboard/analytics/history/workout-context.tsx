import { createContext, useContext } from "react"

type WorkoutContextType = {
  deleteWorkout: (id: string) => void
}

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function useWorkoutContext() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error("useWorkoutContext must be used within a WorkoutProvider")
  return ctx
}