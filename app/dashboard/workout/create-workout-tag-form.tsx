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
  createWorkoutTagFormSchema, 
  CreateWorkoutTagFormSchema 
} from "./create-workout-tag-form.schema"
import { WorkoutTag } from "./workout-form"
import { createWorkoutTag } from "./create-workout-tag-form.action"

export function CreateWorkoutTagForm({
  open,
  setOpen,
  onAddTag,
  className
}: {
  open: boolean,
  setOpen: (open: boolean) => void,
  onAddTag: (tag: WorkoutTag) => void
  className?: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateWorkoutTagFormSchema>({
    resolver: zodResolver(createWorkoutTagFormSchema),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = async (values: CreateWorkoutTagFormSchema) => {
    setIsSubmitting(true)

    await createWorkoutTag(values)
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
            Create Workout Tag
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
              {isSubmitting ? "Creating workout tag" : "Add workout tag"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}