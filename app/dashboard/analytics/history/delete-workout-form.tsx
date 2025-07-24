"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { deleteWorkout } from "./delete-workout"

export function DeleteWorkoutForm({ 
  workoutId,
  workoutName,
  setOpen,
  close,
  onSuccess
}: {
  workoutId: string
  workoutName: string
  setOpen: (open: boolean) => void
  close: () => void
  onSuccess: (id: string) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)

    await deleteWorkout(workoutId)
      .then(() => {
        toast.success("Success", {
          description: `Workout ${workoutName} has been deleted`
        })
        setOpen(false)
        onSuccess(workoutId)
      })
      .catch(e => {
        toast("Error", {
          description: e.message
        })
      })
    
    setIsSubmitting(false)
  }

  return (
    <div>
      <p>
        Are you sure you want to delete  
        <span className="text-destructive"> {workoutName}</span>? 
        This action cannot be undone.
      </p>
      <div className="w-full flex justify-end gap-x-4">
        <Button 
          variant="ghost" 
          disabled={isSubmitting}
          onClick={close}
        >
          Cancel
        </Button>
        <Button 
          variant="destructive" 
          disabled={isSubmitting}
          onClick={handleDelete}
        >
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  )
}