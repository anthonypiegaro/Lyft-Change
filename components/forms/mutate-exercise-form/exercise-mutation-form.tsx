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
  defaultValues,
  onSuccess,
  onError
}: {
  defaultValues?: typeof exerciseMutationFormSchema
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof exerciseMutationFormSchema>>({
    resolver: zodResolver(exerciseMutationFormSchema),
    defaultValues
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

  return (
    <Form {...form}>
      <form>
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