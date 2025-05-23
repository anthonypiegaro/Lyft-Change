"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export type WorkoutRowType = {
  id: string,
  name: string,
  tags: string[]
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
          {tags.map(tag => <Badge key={tag} className="mx-1">{tag}</Badge>)}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      const rowTags = row.getValue(columnId) as string[];
      return filterValue.every((tag: string) => rowTags.includes(tag));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workout = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full flex justify-end">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]