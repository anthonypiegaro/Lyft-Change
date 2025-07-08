"use client"

import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { ExerciseMutationForm } from "@/components/forms/mutate-exercise-form/exercise-mutation-form"
import { ExerciseMutationFormSchema } from "@/components/forms/mutate-exercise-form/exercise-mutation-form.schema"
import { ExerciseMutationFormSkeleton } from "@/components/forms/mutate-exercise-form/exercise-mutation-form-skeleton"

import { getExerciseWithoutUserId } from "./get-exercise-tags.action"



export function EditExerciseForm({ exercise, onSuccess }: { exercise: ExerciseMutationFormSchema, onSuccess: () => void }) {
  const { isPending, error, data } = useQuery({
    queryKey: ['exerciseTags'],
    queryFn: getExerciseWithoutUserId
  })

  if (isPending) {
    return <ExerciseMutationFormSkeleton />
  } else if (error != null) {
    return <div>Error: {error.message}</div>
  }

  const handleSuccess = () => {
    toast.success("Success", {
      description: "Exercise has been updated"
    })
    onSuccess()
  }

  const handleError = (e: Error) => {
    toast.error("Error", {
      description: e.message
    })
  }

  return <ExerciseMutationForm defaultValues={exercise} tags={data} onSuccess={handleSuccess} onError={handleError} />
}
