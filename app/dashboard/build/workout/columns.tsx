"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { DeleteTemplateForm } from "./delete-workout-template-form"

export type WorkoutRowType = {
  id: string,
  name: string,
  tags: { id: string, name: string }[]
}

export const columns: ColumnDef<WorkoutRowType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 w-4 h-4" />
      </Button>
    )
  },
  {
    accessorKey: "tags",
    header: () => <div className="font-semibold">Tags</div>,
    cell: ({ row }) => {
      const tags = row.original.tags

      return (
        <div>
          {tags.map(tag => <Badge key={tag.id} className="mx-1">{tag.name}</Badge>)}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      const rowTags = row.getValue(columnId) as WorkoutRowType["tags"];
      return filterValue.every((tag: string) => rowTags.map(rowTag => rowTag.name).includes(tag));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workout = row.original

      const [form, setForm] = useState<"Delete Workout" | "">("")
      const [open, setOpen] = useState(false)

      const router = useRouter()

      const handleDeleteWorkoutSuccess = () => {
        setOpen(false)
        router.refresh()
      }

      return (
        <Dialog open={open} onOpenChange={setOpen} >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full flex justify-end">
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/workout/template/${workout.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DialogTrigger 
                className="w-full" 
                onClick={() => setForm("Delete Workout")}
              >
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form}</DialogTitle>
            </DialogHeader>
            {form === "Delete Workout" && (
              <DeleteTemplateForm 
                workoutId={workout.id} 
                workoutName={workout.name} 
                onSuccess={handleDeleteWorkoutSuccess}
                close={() => setOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      )
    }
  }
]