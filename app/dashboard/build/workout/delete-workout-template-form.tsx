"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { deleteWorkoutTemplateById } from "./delete-workout-template-by-id.action"

export function DeleteTemplateForm({
  workoutId,
  workoutName,
  onSuccess,
  close
}: {
  workoutId: string
  workoutName: string
  onSuccess: () => void
  close: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    setIsSubmitting(true)
  
    await deleteWorkoutTemplateById(workoutId)
      .then(() => {
        toast.success("Success", {
          description: `${workoutName} has been deleted`
        })
        onSuccess()
      })
      .catch(e => {
        toast.error("Error", {
          description: e.message
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div>
      <p className="mb-4">
        Deleting the workout is permanent. Are you sure you want to delete <span className="font-semibold text-destructive">{workoutName}</span>?
      </p>
      <div className="flex justify-around">
        <Button type="button" variant="destructive" disabled={isSubmitting} onClick={onSubmit}>{isSubmitting ? "Deleting..." : "Delete"}</Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={close}>Cancel</Button>
      </div>
    </div>
  )
}