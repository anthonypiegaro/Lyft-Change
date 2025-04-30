"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  useFieldArray, 
  useForm, 
  UseFormReturn, 
  FieldArrayWithId 
} from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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

type WorkoutFormValues = z.infer<typeof workoutFormSchema>

function Exercise({
  form,
  exerciseField,
  exerciseIndex
}: {
  form: UseFormReturn<WorkoutFormValues>,
  exerciseField: FieldArrayWithId<WorkoutFormValues, "exercises", "id">,
  exerciseIndex: number
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
              <TableHead className="w-[12.5%]">Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sets.map((set, setIndex) => (
              <TableRow key={set.id}>
                <TableCell>{setIndex + 1}</TableCell>
                <InputFields setIndex={setIndex} />
                <TableCell>
                  <FormField 
                    control={form.control}
                    name={`exercises.${exerciseIndex}.sets.${setIndex}`}
                    render={({ field }) => (
                      <FormItem className="flex justify-center">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
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
        >
          Add Set
        </Button>
      </CardContent>
    </Card>
  )
}

export function WorkoutForm() {
  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: "New Workout",
      date: new Date()
    }
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "exercises"
  })

  const onSubmit = async (values: z.infer<typeof workoutFormSchema>) => {

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
    <Form {...form}>
      <form className="flex flex-col gap-y-4 w-full max-w-3xl h-auto">
        <FormField 
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="font-semibold" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
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
          />
        ))}
        <Button
          onClick={addExercise}
          type="button" 
          variant="outline"
        >
            Add Exercise
        </Button>
      </form>
    </Form>
  )
}