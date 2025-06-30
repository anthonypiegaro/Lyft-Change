"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { 
  createProgramTagFormSchema, 
  CreateProgramTagFormSchema 
} from "./create-program-tag-form.schema"
import { ProgramTag } from "./program-form"
import { createProgramTag } from "./create-program-tag.action"

export function CreateProgramTagForm({
  open,
  setOpen,
  onAddTag,
  className
}: {
  open: boolean,
  setOpen: (open: boolean) => void,
  onAddTag: (tag: ProgramTag) => void
  className?: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateProgramTagFormSchema>({
    resolver: zodResolver(createProgramTagFormSchema),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = async (values: CreateProgramTagFormSchema) => {
    setIsSubmitting(true)

    await createProgramTag(values)
      .then(data => {
        onAddTag(data)
        toast.success("Success",{
          description: "Successfully added tag"
        })
        setOpen(false)
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })

    setIsSubmitting(false)
  }

  function handleOpenChange(open: boolean) {
    form.reset()
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          Add Tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Program Tag
          </DialogTitle>
          <DialogDescription>
            *Tag must have unique name
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField 
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Creating program tag" : "Add program tag"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}