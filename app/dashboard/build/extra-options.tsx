"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EllipsisVertical } from "lucide-react"
import { toast } from "sonner"

import { TagForm } from "@/components/forms/create-tag-form/tag-form"
import { ExerciseMutationForm } from "@/components/forms/mutate-exercise-form/exercise-mutation-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { DeleteTags } from "./delete-tags"


type Option = "delete tag" | "add tag" | "add entity";

export function ExtraOptions({
  tags,
  type,
  options=["add entity", "add tag", "delete tag"],
  className,
  size="chevron"
}: {
  tags: { id: string, name: string }[]
  type: "exercise" | "workout" | "program"
  options?: Option[]
  className?: string
  size?: "options" | "chevron"
}) {
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<"Delete Tags" | "Add Tag" | "Add Entity" | "">("")

  const router = useRouter()

  const handleTagSuccess = () => {
    toast.success("Tag created successfully")
    setOpen(false)
    router.refresh()
  }

  const handleTagError = (e: Error) => {
    toast.error("Failed to save tag", {
      description: e.message,
    });
  }

  const handleExerciseSuccess = () => {
    toast.success("Success", {
      description: "Exercise added successfully"
    })
    router.refresh()
  }

  const handleExerciseError = (e: Error) => {
    toast.error("Failed to save exercise", {
      description: e.message,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={size === "options" ? "outline" : "ghost"} className={cn(size === "chevron" && "w-8 h-8", className)}>
              {size === "options" ? <div>Options</div> : (
                <>
                  <span className="sr-only">Open extra options</span>
                  <EllipsisVertical className="w-4 h-4" />
                </>
              )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="align-end">
          <DialogTrigger className={cn("block w-full", !options.includes("add entity") && "hidden")} onClick={type === "exercise" ? () => setFormType("Add Entity") : () => null}>
            <DropdownMenuItem className="capitalize">
              {type === "exercise" && "Add Exercise"}
              {type === "workout" && <Link href="/dashboard/workout/new">Add Workout</Link>}
              {type === "program" && <Link href="/dashboard/program/new">Add Program</Link>}
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger className={cn("block w-full", !options.includes("add tag") && "hidden")} onClick={() => setFormType("Add Tag")}>
            <DropdownMenuItem>Add Tag</DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger className="block w-full" onClick={() => setFormType("Delete Tags")}>
            <DropdownMenuItem variant="destructive">Delete Tags</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formType}
          </DialogTitle>
        </DialogHeader>
        {formType === "Delete Tags" && (
          <DeleteTags tags={tags} type={type} onDelete={() => {
            setFormType("")
            setOpen(false)
          }}/>
        )}
        {formType === "Add Tag" && (
          <TagForm type={type} onSuccess={handleTagSuccess} onError={handleTagError} />
        )}
        {formType === "Add Entity" && (
          <ExerciseMutationForm 
            tags={tags} 
            onError={handleExerciseError}
            onSuccess={handleExerciseSuccess}
            defaultValues={{
              id: undefined,
              type: "weightReps",
              name: "",
              tags: [],
              description: "",
              weightUnit: "lb"
            }}
          /> 
        )}
      </DialogContent>
    </Dialog>
  )
}