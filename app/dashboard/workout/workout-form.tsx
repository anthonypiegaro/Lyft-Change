"use client"

import { useState } from "react"
import { z } from "zod"
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  useFieldArray, 
  useForm, 
  UseFormReturn, 
  FieldArrayWithId 
} from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

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
  DialogTrigger
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
  workoutFormSchema 
} from "@/app/dashboard/workout/workout-form.schema"
import { cn } from "@/lib/utils"

import { ExerciseSelect } from "./exercise-select";

import { createWorkoutInstance } from "./create-workout-instance"
import { createWorkoutTemplate } from "./create-workout-template"

import { ExerciseSelectExercise } from "./exercise-select";

type WorkoutFormValues = z.infer<typeof workoutFormSchema>
type WorkoutType = "instance" | "template"

function Exercise({
  workoutType,
  form,
  exerciseField,
  exerciseIndex,
  isSubmitting
}: {
  workoutType: WorkoutType
  form: UseFormReturn<WorkoutFormValues>
  exerciseField: FieldArrayWithId<WorkoutFormValues, "exercises", "id">
  exerciseIndex: number
  isSubmitting: boolean
}) {
  const { fields: sets, append: appendSet } = useFieldArray({
    control: form.control,
    name: `exercises.${exerciseIndex}.sets`
  })

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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Input {...field} onChange={e => { field.onChange(e.target.value === ""  ? "" : Number(e.target.value))} } disabled={isSubmitting} type="number" />
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
                    <Input {...field} onChange={e => { field.onChange(e.target.value === ""  ? "" : Number(e.target.value))} } disabled={isSubmitting} type="number" />
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
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
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
    <Card key={exerciseField.id}>
      <CardHeader>
        <CardTitle>{exerciseField.name}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12.5%]">Set</TableHead>
              <UnitFields />
              {workoutType == "instance" && <TableHead className="w-[12.5%]">Completed</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sets.map((set, setIndex) => (
              <TableRow key={set.id}>
                <TableCell>{setIndex + 1}</TableCell>
                <InputFields setIndex={setIndex} />
                {workoutType == "instance" && (
                  <TableCell>
                    <FormField 
                      control={form.control}
                      name={`exercises.${exerciseIndex}.sets.${setIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex justify-center">
                          <FormControl>
                            <Checkbox disabled={isSubmitting} />
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
          onClick={() => appendSet({ 
            weight: 0, 
            reps: 0,
            completed: false
          })}
          type="button" 
          variant="outline"
          disabled={isSubmitting}
        >
          Add Set
        </Button>
      </CardContent>
    </Card>
  )
}

export function WorkoutForm({
  tagOptions,
  workoutType,
  defaultValues,
  exercises
}: {
  tagOptions: { label: string, value: string }[]
  workoutType: "instance" | "template"
  defaultValues?: z.infer<typeof workoutFormSchema>
  exercises: ExerciseSelectExercise[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "exercises"
  })

  const onSubmit = async (values: z.infer<typeof workoutFormSchema>) => {
    setIsSubmitting(true)

    if (workoutType === "instance") {
      if (values.id == undefined) {
        await createWorkoutInstance(values)
          .then(() => {
            toast.success("Success", {
              description: `${values.name} has been created successfully.`
            })
          })
          .catch(e => {
            toast.error("Error", {
              description: e.message
            })
          })
      } else {

      }
    } else {
      if (values.id == undefined) {
        await createWorkoutTemplate(values)
          .then(() => {
            toast.success("Success", {
              description: `${values.name} has been created successfully.`
            })
          })
          .catch(e => {
            toast.error("Error", {
              description: e.message
            })
          })
      } else {
        
      }
    }

    setIsSubmitting(false)
  }

  function addExercise() {
    append({
      name: "Bench Press",
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
  }

  return (
    <>
    <Form {...form}>
      <form className="flex flex-col gap-y-4 w-full max-w-3xl h-auto">
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
          <FormField
            control={form.control}
            name="tagIds"
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
        {fields.map((exerciseField, exerciseIndex) => (
          <Exercise 
            form={form}
            key={exerciseField.id}
            exerciseField={exerciseField}
            exerciseIndex={exerciseIndex}
            workoutType={workoutType}
            isSubmitting={isSubmitting}
          />
        ))}
        <Button
          onClick={addExercise}
          type="button" 
          variant="outline"
          disabled={isSubmitting}
        >
            Add Exercise (old)
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button" 
              variant="outline"
              disabled={isSubmitting}
            >
                Add Exercise (new)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ExerciseSelect exercises={exercises} />
          </DialogContent>
        </Dialog>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {workoutType === "instance" ? isSubmitting ? "Finsishing Workout..." : "Finish Workout" : isSubmitting ? "Creating Workout..." : "Create Workout"}
        </Button>
      </form>
    </Form>
    <DevTool control={form.control} />
    </>
  )
}