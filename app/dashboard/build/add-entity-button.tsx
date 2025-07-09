"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExerciseMutationForm } from "@/components/forms/mutate-exercise-form/exercise-mutation-form"

export function AddEntityButton({ 
  type,
  tags
}: { 
  type: "exercise" | "workout" | "program",
  tags: { id: string, name: string }[]
}) {
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const handleSuccess = () => {
    toast.success(`Successfully created ${type}`)
    setOpen(false)
    router.refresh()
  }

  const handleError = (e: Error) => {
    toast.error(`Failed to save ${type}`, {
      description: e.message,
    });
  }

  const form = type === "exercise" 
    ? (
        <ExerciseMutationForm 
          tags={tags} 
          onError={handleError}
          onSuccess={handleSuccess}
          defaultValues={{
            id: undefined,
            type: "weightReps",
            name: "",
            tags: [],
            description: "",
            weightUnit: "lb"
          }}
        /> 
      )
    : type === "workout" ? "Workout Form" 
    : "Program Form"

  return (
    <Dialog open={(type === "workout" || type === "program") ? false : open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 lg:flex capitalize mr-1"
          onClick={
            type === "workout" ? () => router.push("/dashboard/workout/template/new") 
            : type === "program" ? () => router.push("/dashboard/program/new")
            : () => setOpen(true)
          }
        >
          Add {type}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">Add New {type}</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}
