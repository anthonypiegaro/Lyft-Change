"use client"

import { RefObject, useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import * as z from "zod/v4"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FieldArrayWithId,
  useFieldArray, 
  useForm, 
  UseFormReturn
} from "react-hook-form"
import { CalendarIcon, Grip, SquarePen, Trash } from "lucide-react"
import { format } from "date-fns"
import { DndContext, DragEndEvent, DragStartEvent, useDndMonitor } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { toast } from "sonner"

import { usePopup } from "@/components/pop-up-context";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card"
import { Checkbox } from "../../../components/ui/checkbox"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { 
  distanceUnits, 
  repsUnits, 
  timeUnits, 
  weightUnits, 
  workoutFormSchema,
  WorkoutFormSchema
} from "@/app/dashboard/workout/workout-form.schema"
import { cn } from "@/lib/utils"

import { ExerciseSelect } from "./exercise-select";
import { WorkoutInstanceSuccess } from "./workout-instance-success";
import { WorkoutTemplateSuccess } from "./workout-template-success";

import { createWorkoutInstance } from "./create-workout-instance.action"
import { createWorkoutTemplate } from "./create-workout-template.action"

import { ExerciseSelectExercise } from "./exercise-select";
import { CreateWorkoutTagForm } from "./create-workout-tag-form";

type WorkoutType = "instance" | "template"
export type PersonalRecord = string
export type ExerciseTag = { label: string, value: string }
export type WorkoutTag = { label: string, value: string }

function Exercise({
  workoutType,
  form,
  exerciseField,
  exerciseIndex,
  isSubmitting,
  onDelete,
  containerRef
}: {
  workoutType: WorkoutType
  form: UseFormReturn<WorkoutFormSchema>
  exerciseField: FieldArrayWithId<WorkoutFormSchema, "exercises", "id">
  exerciseIndex: number
  isSubmitting: boolean,
  onDelete: () => void
  containerRef: RefObject<HTMLFormElement | null>
}) {
  const [inEditMode, setInEditMode] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const prevActiveItemHeight = useRef(0)
  const localRef = useRef<HTMLDivElement | null>(null);

  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: exerciseField.id})

  useLayoutEffect(() => {
    if (active?.id === exerciseField.id) {
      const currentHeight = localRef.current?.getBoundingClientRect().top ?? 0

      const diff = prevActiveItemHeight.current - currentHeight

      if (containerRef.current !== null) {
        containerRef.current.style.transform = `translateY(${diff}px)`
      }
    
    }
  }, [collapsed])

  function setCombinedRef(node: HTMLDivElement | null) {
    setNodeRef(node)
    localRef.current = node
  }
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%"
  };

  useDndMonitor({
    onDragStart(event: DragStartEvent) { 
      setCollapsed(true)

      if (event.active.id == exerciseField.id) {
        const yPos = localRef.current?.getBoundingClientRect().top

        prevActiveItemHeight.current = yPos ?? 0
      }
    },
    onDragEnd() { setCollapsed(false) }
  })

  const { fields: sets, append: appendSet, remove: removeSet } = useFieldArray({
    control: form.control,
    name: `exercises.${exerciseIndex}.sets`
  })

  function addSet() {
    const exercise = form.getValues(`exercises.${exerciseIndex}`)

    if (exercise.type === "weightReps") {
      appendSet({
        weight: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].weight : 0,
        reps: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].reps : 0,
        completed: false
      },
      { shouldFocus: false }
      )
    } else if (exercise.type === "timeDistance") {
      appendSet({
        time: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].time : 0,
        distance: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].distance : 0,
        completed: false
      },
      { shouldFocus: false }
      )
    }
  }

  const UnitFields = () => {
    if (exerciseField.type == "weightReps") {
      return (
        <>
          <TableHead className="w-[37.5%]">
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.units.weight`}
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {weightUnits.options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </TableHead>
          <TableHead className="w-[37.5%]">
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.units.reps`}
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {repsUnits.options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </TableHead>
        </>
      )
    } else if (exerciseField.type == "timeDistance") {
      return (
        <>
          <TableHead className="w-[37.5%]">
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.units.time`}
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeUnits.options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </TableHead>
          <TableHead className="w-[37.5%]">
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.units.distance`}
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {distanceUnits.options.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </TableHead>
        </>
      )
    }

    return <></>
  }

  const InputFields = ({ setIndex }: { setIndex: number }) => {
    if (exerciseField.type == "weightReps") {
      return (
        <>
          <TableCell>
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={e => { field.onChange(e.target.value === ""  ? "" : form.watch(`exercises.${exerciseIndex}.units.weight`) === "g" ? Math.trunc(Number(e.target.value)) : Math.trunc(Number(e.target.value) * 100) / 100) } }
                      onWheel={e => { e.currentTarget.blur() }}
                      onFocus={e => e.target.select()}
                      disabled={isSubmitting} type="number" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TableCell>
          <TableCell>
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={e => { field.onChange(e.target.value === ""  ? "" : Math.trunc(Number(e.target.value)))}}
                      onWheel={e => { e.currentTarget.blur() }}
                      onFocus={e => e.target.select()}
                      disabled={isSubmitting} type="number" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TableCell>
        </>
      )
    } else if (exerciseField.type == "timeDistance") {
      return (
        <>
          <TableCell>
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.sets.${setIndex}.time`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={e => { field.onChange(e.target.value === ""  ? "" : form.watch(`exercises.${exerciseIndex}.units.time`) === "ms" ? Math.trunc(Number(e.target.value)) : Math.trunc(Number(e.target.value) * 100) / 100) }}
                      onWheel={e => { e.currentTarget.blur() }}
                      onFocus={e => e.target.select()}
                      disabled={isSubmitting} type="number" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TableCell>
          <TableCell>
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.sets.${setIndex}.distance`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field} 
                      onChange={e => { field.onChange(e.target.value === ""  ? "" : form.watch(`exercises.${exerciseIndex}.units.distance`) === "mm" ? Math.trunc(Number(e.target.value)) :  Math.trunc(Number(e.target.value) * 100) / 100) }}
                      onWheel={e => { e.currentTarget.blur() }}
                      onFocus={e => e.target.select()}
                      disabled={isSubmitting} type="number" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TableCell>
        </>
      )
    }

    return <></>
  }

  return (
    <div key={exerciseField.id} ref={setCombinedRef} style={style} {...attributes} className={"relative mb-4 touch-none"}>
    <Card className="select-none lg:select-auto">
      {!collapsed && (
        <Button type="button" onClick={onDelete} variant="ghost" className="absolute bottom-2 right-2">
          <Trash className="text-destructive"/>
        </Button>
      )}
      <CardHeader>
        <CardTitle>{exerciseField.name}</CardTitle>
        {!collapsed && (
          <CardDescription>
            <FormField 
              control={form.control}
              name={`exercises.${exerciseIndex}.notes`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardDescription>
        )}
      </CardHeader>
      {!collapsed && (
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {inEditMode && <TableHead></TableHead>}
                <TableHead className="w-[12.5%] flex items-center">
                  Set
                  <Button type="button" variant="ghost" onClick={() => setInEditMode(prev => !prev)}>
                    <SquarePen />
                  </Button>
                </TableHead>
                <UnitFields />
                {workoutType == "instance" && (
                  <TableHead className="w-[12.5%]">
                    <span className="inline sm:hidden">✓</span>
                    <span className="hidden sm:inline">Completed</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sets.map((set, setIndex) => (
                <TableRow key={set.id}>
                  {inEditMode && (
                    <TableCell>
                      <Button type="button" variant="ghost" onClick={() => removeSet(setIndex)}>
                        <Trash className="text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                  <TableCell>{setIndex + 1}</TableCell>
                  <InputFields setIndex={setIndex} />
                  {workoutType == "instance" && (
                    <TableCell>
                      <FormField 
                        control={form.control}
                        name={`exercises.${exerciseIndex}.sets.${setIndex}.completed`}
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            className="my-4"
            onClick={() => addSet()}
            type="button" 
            variant="outline"
            disabled={isSubmitting}
          >
            Add Set
          </Button>
        </CardContent>
      )}
    </Card>
    <Button type="button" variant="ghost" className="absolute top-4 right-4 cursor-grab active:cursor-grabbing touch-none" {...listeners}>
      <Grip />
    </Button>
    </div>
  )
}

export function WorkoutForm({
  initExerciseTags,
  initWorkoutTags,
  workoutType,
  defaultValues,
  initExercises
}: {
  initExerciseTags: ExerciseTag[]
  initWorkoutTags: WorkoutTag[]
  workoutType: "instance" | "template"
  defaultValues: z.infer<typeof workoutFormSchema>
  initExercises: ExerciseSelectExercise[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exerciseSelectionOpen, setExerciseSelectionOpen] = useState(false)
  const [exercises, setExercises] = useState(initExercises)
  const [exerciseTags, setExerciseTags] = useState<ExerciseTag[]>(initExerciseTags)
  const [workoutTags, setWorkoutTags] = useState<WorkoutTag[]>(initWorkoutTags)
  const [workoutTagFormOpen, setWorkoutTagFormOpen] = useState(false)

  const container = useRef<HTMLFormElement | null>(null)

  const router = useRouter()

  const { showPopup } = usePopup()

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises"
  })

  const onSubmit = async (values: z.infer<typeof workoutFormSchema>) => {
    setIsSubmitting(true)

    if (workoutType === "instance") {
      await createWorkoutInstance(values)
        .then(data => {
          showPopup(<WorkoutInstanceSuccess formValues={values} personalRecords={data.personalRecords} />)
          router.push("/dashboard")
        })
        .catch(e => {
          toast.error("Error", {
            description: e.message
          })
        })

    } else {
      await createWorkoutTemplate(values)
        .then(() => {
          if (values.id == undefined) {
            showPopup(<WorkoutTemplateSuccess formValues={values} newTemplate={true}/>)
          } else {
            showPopup(<WorkoutTemplateSuccess formValues={values} newTemplate={false} />)
          }
          router.push("/dashboard/build/workout")
        })
        .catch(e => {
          toast.error("Error", {
            description: e.message
          })
        })
    }

    setIsSubmitting(false)
  }

  function handleAddExerciseTag(selectedExerciseTag: ExerciseTag) {
    setExerciseTags(prev => [...prev, selectedExerciseTag ])
  }

  function handleAddWorkoutTag(selectedWorkoutTag: WorkoutTag) {
    setWorkoutTags(prev => [...prev, selectedWorkoutTag])
  }

  function addExercise(selectedExercise: ExerciseSelectExercise) {
    if (selectedExercise.type.name === "weightReps") {
      append({
        exerciseId: selectedExercise.id,
        name: selectedExercise.name,
        type: "weightReps",
        notes: "",
        units: {
          weight: "lb",
          reps: "reps"
        },
        sets: []
        },
        {
          shouldFocus: false
        }
      )
    } else if (selectedExercise.type.name === "timeDistance") {
      append({
        exerciseId: selectedExercise.id,
        name: selectedExercise.name,
        type: "timeDistance",
        notes: "",
        units: {
          time: "m",
          distance: "mi"
        },
        sets: []
        },
        {
          shouldFocus: false
        }
      )
    }

    setExerciseSelectionOpen(false)
  }

  function handleExerciseCreation(exercise: ExerciseSelectExercise) {
    setExercises(prev => [...prev, exercise])
  }

  function handleAddExercises(selectedExercises: ExerciseSelectExercise[]) {
    selectedExercises.forEach(exercise => addExercise(exercise))
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
      const from = fields.findIndex(field => field.id === active.id);
      const to = fields.findIndex(field => field.id === over?.id)

      move(from, to)
    }

    if (container.current) {
      container.current.style.transform = "translateY(0px)"
    }
  }

  return (
    <>
    <Form {...form}>
      <form ref={container} className="flex flex-col gap-y-4 w-full max-w-3xl h-auto">
        <h1 className="text-3xl font-semibold mx-auto pb-10 lg:text-4xl">{workoutType === "instance" ? "Workout Logger" : "Workout Builder"}</h1>
        <FormField 
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="font-semibold" {...field} disabled={isSubmitting} />
              </FormControl>
            </FormItem>
          )}
        />
        {workoutType === "instance" && (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={isSubmitting}
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {workoutType === "template" && (
          <div className="flex gap-x-2">
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem className="flex-1 max-w-sm">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={workoutTags}
                      onValueChange={selectedTags => field.onChange(selectedTags)}
                      placeholder="Select tags..."
                      defaultValue={field.value}
                      maxCount={3}
                      className="dark:bg-input/30"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CreateWorkoutTagForm 
              open={workoutTagFormOpen} 
              setOpen={setWorkoutTagFormOpen} 
              onAddTag={handleAddWorkoutTag}
              className="self-end"
            />
          </div>
        )}
        <FormField 
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Separator />
        {fields.length === 0 && (
          <div className="flex flex-col justify-center items-center gap-y-2 w-full h-64 border border-dashed rounded-md">
            <p>No exercises added yet</p>
            <Button
              type="button" 
              variant="outline"
              onClick={() => setExerciseSelectionOpen(true)}
              disabled={isSubmitting}
            >
                Add Exercise
            </Button>
          </div>
        )}
        <div>
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map(field => field.id)} strategy={verticalListSortingStrategy}>
              {fields.map((exerciseField, exerciseIndex) => (
                <Exercise 
                  form={form}
                  key={exerciseField.id}
                  exerciseField={exerciseField}
                  exerciseIndex={exerciseIndex}
                  workoutType={workoutType}
                  isSubmitting={isSubmitting}
                  onDelete={() => remove(exerciseIndex)}
                  containerRef={container}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <Separator />
        {fields.length > 0 && (
          <Button
            type="button" 
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setExerciseSelectionOpen(true)}
          >
              Add Exercise
          </Button>
      )}
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {workoutType === "instance" ? isSubmitting ? "Finsishing Workout..." : "Finish Workout" : isSubmitting ? "Creating Workout..." : "Create Workout"}
        </Button>
      </form>
    </Form>

    <Dialog open={exerciseSelectionOpen} onOpenChange={setExerciseSelectionOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Exercise Select</DialogTitle>
        </DialogHeader>
        <ExerciseSelect 
          exercises={exercises} 
          tagOptions={exerciseTags} 
          onAdd={handleAddExercises}
          onAddTag={handleAddExerciseTag}
          onExerciseCreation={handleExerciseCreation}
        />
      </DialogContent>
    </Dialog>
    <DevTool control={form.control} />
    </>
  )
}