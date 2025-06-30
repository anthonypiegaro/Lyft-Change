"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
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
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { createExercise } from "./create-exercise-form.action"
import { createExerciseFormSchema } from "./create-exercise-form.schema"
import { ExerciseSelectExercise } from "./exercise-select"
import { CreateExerciseTagForm } from "./create-exercise-tag-form"
import { ExerciseTag } from "./workout-form"

export function CreateExerciseForm({
  defaultValues,
  tagOptions,
  onAddTag,
  onAdd,
  open,
  onOpenChange
}: {
  defaultValues: z.infer<typeof createExerciseFormSchema>
  tagOptions: { label: string, value: string }[]
  onAddTag: (tag: ExerciseTag) => void
  onAdd: (exercise: ExerciseSelectExercise) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagFormOpen, setTagFormOpen] = useState(false)

  const form = useForm<z.infer<typeof createExerciseFormSchema>>({
    resolver: zodResolver(createExerciseFormSchema),
    defaultValues
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, defaultValues, form])

  const onSubmit = async (values: z.infer<typeof createExerciseFormSchema>) => {
    setIsSubmitting(true)

    await createExercise(values)
      .then(data => {
        const newExercise: ExerciseSelectExercise = {
          id: data.id,
          name: values.name,
          type: {
            id: data.typeId,
            name: values.type
          },
          tags: values.tags.map(tag => ({
            id: tag,
            name: tagOptions.find(tagOption => tagOption.value === tag)?.label as string
          }))
        }

        onAdd(newExercise)
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Exercise</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-y-4">
            <FormField 
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weightReps">Weight | Reps</SelectItem>
                      <SelectItem value="timeDistance">Time | Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-2 w-full">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={tagOptions}
                        onValueChange={selectedTags => field.onChange(selectedTags)}
                        placeholder="Select tags..."
                        defaultValue={field.value}
                        maxCount={3}
                        modalPopover
                        className="max-w-sm dark:bg-input/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <CreateExerciseTagForm className="self-end" open={tagFormOpen} setOpen={setTagFormOpen} onAddTag={onAddTag} />
            </div>
            <FormField 
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="self-end">
              <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Creating exercise..." : "Create Exercise"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}