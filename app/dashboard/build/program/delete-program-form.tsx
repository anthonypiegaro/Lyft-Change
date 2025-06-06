"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { deleteProgram } from "./delete-program-form.action"

export function DeleteProgramForm({
  programId,
  programName,
  closeForm
}: {
  programId: string
  programName: string
  closeForm: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsSubmitting(true)

    await deleteProgram(programId)
      .then(() => {
        toast.success("Success", {
          description: `Program "${programName}" has been deleted`
        })
        closeForm()
        router.refresh()
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })

    setIsSubmitting(false)
  }

  return (
    <div className="w-full">
      <p>
        Are you sure you want to delete <span className="text-destructive">{programName}</span>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end">
        <Button variant="ghost" disabled={isSubmitting} className="mr-2" onClick={closeForm}>Cancel</Button>
        <Button variant="destructive" disabled={isSubmitting} onClick={handleDelete}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  )
}