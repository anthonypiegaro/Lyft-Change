"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { hideExerciseById } from "./hide-exercise-form.action"

export function HideExerciseForm({
  exerciseId,
  exerciseName,
  onSuccess,
  close
}: {
  exerciseId: string
  exerciseName: string
  onSuccess: () => void
  close: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    setIsSubmitting(true)
  
    await hideExerciseById(exerciseId)
      .then(() => {
        toast.success("Success", {
          description: `${exerciseName} has been hidden`
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
        Hiding the exercise is permanent. Are you sure you want to hide <span className="font-semibold text-destructive">{exerciseName}</span>?
      </p>
      <div className="flex justify-around">
        <Button type="button" variant="destructive" disabled={isSubmitting} onClick={onSubmit}>{isSubmitting ? "Hidding..." : "Hide"}</Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={close}>Cancel</Button>
      </div>
    </div>
  )
}