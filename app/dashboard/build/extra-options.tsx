"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVertical } from "lucide-react"
import { toast } from "sonner"

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
import { TagForm } from "@/components/forms/create-tag-form/tag-form"

type Option = "delete tag" | "add tag" | "add entity";

export function ExtraOptions({
  tags,
  type,
  options=["add entity", "add tag", "delete tag"],
  className,
  size="large"
}: {
  tags: { id: string, name: string }[]
  type: "exercise" | "workout" | "program"
  options?: Option[]
  className?: string
  size?: "small" | "large"
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={size === "small" ? "outline" : "ghost"} className={cn(size === "large" && "w-8 h-8", className)}>
              {size === "small" ? <div>Options</div> : (
                <>
                  <span className="sr-only">Open extra options</span>
                  <EllipsisVertical className="w-4 h-4" />
                </>
              )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="align-end">
          <DialogTrigger className={cn("block w-full", !options.includes("add entity") && "hidden")} onClick={() => setFormType("Add Entity")}>
            <DropdownMenuItem className="capitalize">Add {type}</DropdownMenuItem>
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
      </DialogContent>
    </Dialog>
  )
}