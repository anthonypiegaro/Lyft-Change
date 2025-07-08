"use client"

import { useState } from "react"
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
import { exerciseMutationFormSchema, ExerciseMutationFormSchema } from "./exercise-mutation-form.schema"

export function ExerciseMutationForm({
  tags,
  defaultValues,
  onSuccess,
  onError
}: {
  tags: { id: string, name: string }[]
  defaultValues: ExerciseMutationFormSchema
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ExerciseMutationFormSchema>({
    resolver: zodResolver(exerciseMutationFormSchema),
    defaultValues
  })

  const onSubmit = async (values: ExerciseMutationFormSchema) => {
    setIsSubmitting(true)

    await mutateExercise(values)
      .then(() => { 
        onSuccess?.()
        form.reset({
          id: undefined,
          type: "weightReps",
          name: "",
          tags: [],
          description: "",
          weightUnit: "lb"
        })
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

  const handleTypeChange = (value: string, onChange: (value: string) => void) => {
    if (value === "weightReps") {
      form.setValue("weightUnit", "lb")
    } else if (value === "timeDistance") {
      form.setValue("timeUnit", "m")
      form.setValue("distanceUnit", "mi")
    }

    onChange(value)
  }

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
                onValueChange={value => handleTypeChange(value, field.onChange)} 
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
        {
          form.watch("type") === "weightReps" && (
            <FormField 
              control={form.control}
              name="weightUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )
        }
        {
          form.watch("type") === "timeDistance" && (
            <div className="flex gap-x-4">
              <FormField 
                control={form.control}
                name="timeUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ms">ms</SelectItem>
                        <SelectItem value="s">s</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="h">h</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="distanceUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mm">mm</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="km">km</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="yd">yd</SelectItem>
                        <SelectItem value="mi">mi</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          )
        }
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
                  modalPopover
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
            defaultValues.id
              ? (isSubmitting ? "Updating" : "Update") 
              : (isSubmitting ? "Creating" : "Create")
          }
        </Button>
      </form>
    </Form>
  )
}