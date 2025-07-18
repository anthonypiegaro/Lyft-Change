"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TagForm } from "@/components/forms/create-tag-form/tag-form"
import { cn } from "@/lib/utils"

export function AddTagButton({ 
  type,
  className 
}: { 
  type: "exercise" | "workout" | "program"
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    toast.success("Tag created successfully")
    setOpen(false)
    router.refresh()
  }

  const handleError = (e: Error) => {
    toast.error("Failed to save tag", {
      description: e.message,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8", className)}
          onClick={() => setOpen(true)}
        >
          Add Tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
          <DialogDescription>
            *Tag must have unique name
          </DialogDescription>
        </DialogHeader>
        <TagForm type={type} onSuccess={handleSuccess} onError={handleError}/>
      </DialogContent>
    </Dialog>
  )
}
