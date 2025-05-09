"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Settings2 
} from "lucide-react"
 
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { EditExerciseForm } from "./edit-exercise-form"

export type ExerciseRowType = {
  id: string
  name: string
  type: "weightReps" | "timeDistance"
  tags: { id: string, name: string }[]
  description: string
}

export type ExerciseMutationType = {
  id: string
  name: string
  type: "weightReps" | "timeDistance"
  tags: string[]
  description: string
}

const typeMap: Record<ExerciseRowType["type"], string> = {
  "weightReps": "Weight Reps",
  "timeDistance": "Time Distance"
}

const allTypes: ExerciseRowType["type"][] = ["weightReps", "timeDistance"]

export const columns: ColumnDef<ExerciseRowType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    )
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      const selectedTypes = 
        (column.getFilterValue() as ExerciseRowType["type"][]) ?? allTypes

      const handleCheckChange = (value: ExerciseRowType["type"]) => {
        if (selectedTypes.includes(value)) {
          column.setFilterValue(
            selectedTypes.filter(val => val !== value)
          )
        } else {
          column.setFilterValue([...selectedTypes, value])
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
            >
              Type
              <Settings2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTypes.map(type => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleCheckChange(type)}
              >
                {typeMap[type]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    cell: ({ row }) => <div>{typeMap[row.getValue("type") as ExerciseRowType["type"]]}</div>,
    filterFn: (row, columnId, filterValue) => {
      if (typeof filterValue === "undefined") return true;
      if (Array.isArray(filterValue) && filterValue.length === 0) return false;
      return filterValue.includes(row.getValue(columnId));
    }
  },
  {
    accessorKey: "tags",
    header: ({ column }) => <div className="font-semibold">Tags</div>,
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
      const rowTags = row.getValue(columnId) as ExerciseRowType["tags"];
      return filterValue.every((tag: string) => rowTags.map(rowTag => rowTag.name).includes(tag));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exerciseRow = row.original

      const exercise: ExerciseMutationType = {
        ...exerciseRow,
        tags: exerciseRow.tags.map(tag => tag.id)
      }

      const [form, setForm] = useState<"Edit Exercise" | "Hide Exercise" | "">("")
      const [open, setOpen] = useState(false)

      const router = useRouter()

      const onEditExerciseSuccess = () => {
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
              <DropdownMenuItem>Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger className="w-full" onClick={() => setForm("Edit Exercise")}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger className="w-full" onClick={() => setForm("Hide Exercise")}>
                <DropdownMenuItem>Hide</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form}</DialogTitle>
            </DialogHeader>
            {form == "Edit Exercise" && <EditExerciseForm exercise={exercise} onSuccess={onEditExerciseSuccess} />}
          </DialogContent>
        </Dialog>
      )
    }
  }
]
