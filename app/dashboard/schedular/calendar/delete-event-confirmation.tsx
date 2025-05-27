"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

export function DeleteEventConfirmation({
  workoutId,
  workoutName,
  isOpen,
  onOpenChange,
  isSubmitting,
  onDelete
}: {
  workoutId: string
  workoutName: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting: boolean
  onDelete: (id: string) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workout</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete <span className="text-destructive">{workoutName}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end">
          <Button variant="ghost" disabled={isSubmitting} className="mr-2" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" disabled={isSubmitting} onClick={() => onDelete(workoutId)}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}