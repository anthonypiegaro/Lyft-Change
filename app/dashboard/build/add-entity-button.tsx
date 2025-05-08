"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AddEntityButton({ type }: { type: "exercise" | "workout" | "program" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 lg:flex capitalize"
        >
          Add {type}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">Add New {type}</DialogTitle>
        </DialogHeader>
        <p>Form goes here</p>
      </DialogContent>
    </Dialog>
  )
}
