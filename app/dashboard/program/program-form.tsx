"use client"

import React, { useLayoutEffect, useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import { Dumbbell, Hammer } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { ProgramCalendar } from "./program-calendar"
import { WorkoutList } from "./workout-list"
import { WorkoutCardPlain } from "./workout-card"
import { OverlayCalendarWorkoutEvent } from "./program-calendar"

export type ProgramTag = {
  id: string
  name: string
}

export type WorkoutTag = {
  id: string,
  name: string
}

export type WorkoutItem = {
  workoutId: string
  name: string
  tags: {
    id: string
    name: string
  }[]
}

export const programFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  description: z.string().optional(),
  tagIds: z.array(z.string()),
  workouts: z.array(z.object({
    workoutId: z.string(),
    name: z.string(),
    day: z.number()
  }))
})

export type ProgramFormSchema = z.infer<typeof programFormSchema>

export function ProgramForm({ 
  defaultValues,
  programTags,
  workoutTags,
  workouts
}: {
  defaultValues?: ProgramFormSchema
  programTags: ProgramTag[]
  workoutTags: WorkoutTag[]
  workouts: WorkoutItem[]
}) {
  const workoutListRef = useRef<HTMLDivElement>(null)
  const [calendarMaxHeight, setCalendarMaxHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [weeks, setWeeks] = useState(1)
  const [activeWorkout, setActiveWorkout] = useState<{ workout: WorkoutItem, start: number } | null>(null)

  useLayoutEffect(() => {
    if (workoutListRef.current) {
      setCalendarMaxHeight(workoutListRef.current.offsetHeight);
    }
  }, []);

  const form = useForm<ProgramFormSchema>({
    resolver: zodResolver(programFormSchema),
    defaultValues
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "workouts"
  })

  const handleAddWeek = () => { setWeeks(prev => prev + 1) }

  const getActiveDays = () => {
    const formWorkouts = form.watch("workouts")

    const activeDays = new Set<number>()

    formWorkouts.forEach(formWorkout => activeDays.add(formWorkout.day))

    return activeDays.size
  }

  const handleRemoveWorkout = (id: string) => {
    const index = fields.findIndex(field => field.id === id)

    if (index !== -1) remove(index)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveWorkout({
      workout: event.active.data.current?.workout,
      start: event.active.data.current?.start
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const workout = event.active.data.current?.workout
    const fieldIndex = event.active.data.current?.fieldIndex
  
    if (fieldIndex !== undefined && event.over && event.over.id !== null) {
      update(fieldIndex, { ...workout, day: event.over.id})

    } else if (event.over && event.over.id !== null) {
      append({
        ...workout,
        day: event.over.id
      })
    }

    setActiveWorkout(null)
  }

  return (
    <div className="flex flex-col gap-y-4 w-full h-full mx-auto max-w-7xl py-7 px-2 md:pl-0 md:pr-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-4">
            <Dumbbell />
            <div>
              <h1 className="text-3xl mb-1">Program Builder</h1>
              <p className="text-muted-foreground font-normal">Build custom programs using drag and drop</p>
            </div>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-y-4 sm:flex-row gap-x-4">
          <Form {...form}>
            <form className="flex flex-col grow gap-y-4">
              <FormField 
                control={form.control}
                name="name"
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
              <FormField 
                control={form.control}
                name="tagIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect 
                        options={programTags.map(tag => ({ label: tag.name, value: tag.id }))}
                        onValueChange={selectedTags => field.onChange(selectedTags)}
                        defaultValue={field.value}
                        maxCount={5}
                        className="dark:bg-input/30"
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
                    <Textarea 
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex flex-col justify-between">
            <Card>
              <CardContent className="md:min-w-xs lg:min-w-sm">
                <h2 className="text-xl mb-2">Program Stats</h2>
                <div className="flex justify-between gap-x-1">
                  <p className="text-muted-foreground">Duration</p>
                  <p>{weeks} week{weeks > 1 && "s"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Workouts</p>
                  <p>{form.watch("workouts").length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Active Days</p>
                  <p>{getActiveDays()}</p>
                </div>
              </CardContent>
            </Card>
            <Button type="button" disabled={isSubmitting}>
              <Hammer /> {isSubmitting ? "Building program..." : "Build Program"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-x-4 grow">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div ref={workoutListRef}>
            <WorkoutList 
              workouts={workouts} 
              tags={workoutTags}
            />
          </div>
          <div className="grow" style={{ height: calendarMaxHeight || undefined, maxHeight: calendarMaxHeight || undefined }}>
            <ProgramCalendar 
              weeks={weeks} 
              onAddWeek={handleAddWeek} 
              maxHeight={calendarMaxHeight}
              workouts={fields}
              onRemoveWorkout={handleRemoveWorkout}
            />
          </div>
          <DragOverlay dropAnimation={null}>
            {
              activeWorkout !== null ?
              activeWorkout.start ? <WorkoutCardPlain workout={activeWorkout.workout} start={activeWorkout.start} />
              : <OverlayCalendarWorkoutEvent workoutName={activeWorkout.workout.name} /> 
              : null
            }
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}