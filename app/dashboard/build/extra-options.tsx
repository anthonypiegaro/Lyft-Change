"use client"

import { useState } from "react"
import { EllipsisVertical } from "lucide-react"

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

import { DeleteTags } from "./delete-tags"

export function ExtraOptions({
  tags,
  type
}: {
  tags: { id: string, name: string }[]
  type: "exercise" | "workout" | "program"
}) {
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<"Delete Tags" | "">("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8">
            <span className="sr-only">Open extra options</span>
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="align-end">
          <DialogTrigger className="w-full" onClick={() => setFormType("Delete Tags")}>
            <DropdownMenuItem>Delete Tags</DropdownMenuItem>
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
      </DialogContent>
    </Dialog>
  )
}