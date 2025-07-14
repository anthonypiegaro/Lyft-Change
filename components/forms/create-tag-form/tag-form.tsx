"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

import { tagFormSchema } from "./tag-form.schema"
import { createTag } from "./tag-form.action"

export function TagForm({
  type,
  onSuccess,
  onError
}: {
  type: "exercise" | "workout" | "program"
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof tagFormSchema>>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: "",
      type
    }
  })

  const onSubmit = async (values: z.infer<typeof tagFormSchema>) => {
    setIsSubmitting(true)
    await createTag(values)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <FormField 
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting}>
          {isSubmitting ? "Adding tag..." : "Add tag"}
        </Button>
      </form>
    </Form>
  )
}
