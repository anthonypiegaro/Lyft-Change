"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { DeleteProgramForm } from "./delete-program-form"

export type ProgramRowType = {
  id: string,
  name: string,
  tags: { id: string, name: string }[]
}

export const columns: ColumnDef<ProgramRowType>[] = [
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
      const rowTags = row.getValue(columnId) as ProgramRowType["tags"];
      return filterValue.every((tag: string) => rowTags.map(rowTag => rowTag.name).includes(tag));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
  
      const program = row.original

      const router = useRouter()

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full flex justify-end">
                <Button
                  className="h-8 w-8 p-0"
                  variant="ghost"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/program/${program.id}`)}>Edit</DropdownMenuItem>
              <DialogTrigger className="w-full">
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Program</DialogTitle>
            </DialogHeader>
            <DeleteProgramForm programId={program.id} programName={program.name} closeForm={() => setOpen(false)}/>
          </DialogContent>
        </Dialog>
      )
    }
  }
]
