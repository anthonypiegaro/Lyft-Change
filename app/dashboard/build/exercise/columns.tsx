"use client"

import { ColumnDef } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Settings2 
} from "lucide-react"
 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export type ExerciseRowType = {
  id: string
  name: string
  type: "weightReps" | "timeDistance",
  tags: string[]
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
    header: () => <div className="font-semibold">Tags</div>,
    cell: ({ row }) => {
      const tags = row.original.tags

      return (
        <div>
          {tags.map(tag => <Badge key={tag} className="mx-1">{tag}</Badge>)}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const exercise = row.original

      return (
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Hide</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
