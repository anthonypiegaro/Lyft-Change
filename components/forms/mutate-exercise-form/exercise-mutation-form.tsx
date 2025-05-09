"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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

import { mutateExercise } from "./exercise-mutation-form.action"
import { exerciseMutationFormSchema } from "./exercise-mutation-form.schema"

export function ExerciseMutationForm({
  tags,
  defaultValues,
  onSuccess,
  onError
}: {
  tags: { id: string, name: string }[]
  defaultValues?: z.infer<typeof exerciseMutationFormSchema>
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof exerciseMutationFormSchema>>({
    resolver: zodResolver(exerciseMutationFormSchema),
    defaultValues: {
      id: defaultValues?.id,
      type: defaultValues?.type ?? "weightReps",
      name: defaultValues?.name ?? "",
      tags: defaultValues?.tags ?? [],
      description: defaultValues?.description ?? "",
    }
  })

  const onSubmit = async (values: z.infer<typeof exerciseMutationFormSchema>) => {
    setIsSubmitting(true)

    await mutateExercise(values)
      .then(() => { 
        onSuccess?.()
        form.reset()
      })
      .catch(e => { 
        onError?.(e as Error)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const tagOptions = tags.map(tag => ({
    label: tag.name,
    value: tag.id
  }))

  return (
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
                disabled={isSubmitting || defaultValues?.id !== undefined}
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
              <FormMessage />
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
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <MultiSelect
                  options={tagOptions}
                  onValueChange={selectedTags => field.onChange(selectedTags)}
                  placeholder="Select tags..."
                  defaultValue={field.value}
                  maxCount={3}
                  className="max-w-sm dark:bg-input/30"
                />
              </FormControl>
            </FormItem>
          )}
        />
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
        <Button
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
          type="button"
          className="self-start"
        >
          {
            defaultValues 
              ? (isSubmitting ? "Updating" : "Update") 
              : (isSubmitting ? "Creating" : "Create")
          }
        </Button>
      </form>
    </Form>
  )
}