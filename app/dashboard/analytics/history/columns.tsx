"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { deleteWorkout } from "./delete-workout"
import { DeleteWorkoutForm } from "./delete-workout-form"
import { useWorkoutContext } from "./workout-context"

export type Workout = {
  id: string
  name: string
  description: string
  date: string
}

export const columns: ColumnDef<Workout>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="w-50 sm:w-80 md:w-125 truncate">{row.getValue("name")}</div>
  },
  {
    accessorKey: "description",
    header: () => <div className="max-lg:hidden">Description</div>,
    cell: ({ row }) => <div className="max-lg:hidden lg:w-55 xl:w-75 2xl:w-100 truncate">{row.getValue("description")}</div>
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    sortingFn: "datetime"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workout = row.original

      const [open, setOpen] = useState(false)
      const [formType, setFormType] = useState<"delete" | null>(null)
  
      const router = useRouter()
      const { deleteWorkout } = useWorkoutContext()

      const openDeleteForm = () => {
        setOpen(true)
        setFormType("delete")
      }

      const handleOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
          setFormType(null)
        }
      }

      const handleClose = () => {
        setOpen(false)
        setFormType(null)
      }

      const handleDeleteSuccess = (workoutId: string) => {
        deleteWorkout(workoutId)
      }
 
      return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* do details later */}
                {/* <DropdownMenuItem>Details</DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => router.push(`/dashboard/workouts/${workout.id}`)}>Edit</DropdownMenuItem>
                <DialogTrigger className="w-full" onClick={openDeleteForm}>
                  <DropdownMenuItem variant="destructive">
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {formType === "delete" && "Delete Workout"}
                </DialogTitle>
              </DialogHeader>
              {formType === "delete" && (
                <DeleteWorkoutForm 
                  workoutId={workout.id}
                  workoutName={workout.name}
                  setOpen={setOpen}
                  close={handleClose}
                  onSuccess={handleDeleteSuccess}
                />
              )}
            </DialogContent>
          </div>
        </Dialog>
      )
    }
  }
]