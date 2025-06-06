"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format } from "date-fns"
import { LottieRefCurrentProps } from "lottie-react"
import { CalendarIcon } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { UseCalendarReturn } from "@/components/calendar/use-calendar";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import shapeAnimation from "@/public/lottie/shape-animation.json"

import { Program, ProgramTag } from "./calendar";
import { addProgramToCalendar } from "./add-program-from.action";

import { WorkoutEvent } from "./calendar";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const addProgramFormSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  date: z.date()
})

export type AddProgramFormSchema = z.infer<typeof addProgramFormSchema>

export function AddProgramForm({
  open,
  onOpenChange,
  programs,
  programTags,
  calendar
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  programs: Program[]
  programTags: ProgramTag[]
  calendar: UseCalendarReturn<WorkoutEvent>
}) {
  const form = useForm<AddProgramFormSchema>({
    resolver: zodResolver(addProgramFormSchema),
    defaultValues: {
      id: "",
      name: "",
      date: new Date()
    }
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }

    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Program</DialogTitle>
        </DialogHeader>
        <ProgramForm 
          programs={programs} 
          programTags={programTags} 
          form={form}
          onOpenChange={handleOpenChange}
          calendar={calendar}
        />
      </DialogContent>
    </Dialog>
  )
}

export function ProgramForm({
  programs,
  programTags,
  form,
  onOpenChange,
  calendar
}: {
  programs: Program[]
  programTags: ProgramTag[]
  form: UseFormReturn<AddProgramFormSchema>
  onOpenChange: (open: boolean) => void
  calendar: UseCalendarReturn<WorkoutEvent>
}) {
  const parentRef = useRef(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  const [nameFilter, setNameFilter] = useState("")
  const [tagIdsFilter, setTagIdsFilter] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const filteredPrograms = useMemo(() => {
    return programs
      .filter(program => program.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(program => tagIdsFilter.every(tag => program.tags.some(programTag => programTag.id === tag)))
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [programs, nameFilter, tagIdsFilter, parentRef])

  const getItemKey = useCallback(
    (index: number) => filteredPrograms[index].id,
    [filteredPrograms]
  )

  const virtualizer = useVirtualizer({
    count: filteredPrograms.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 85,
    paddingStart: 10,
    paddingEnd: 10,
  })

  const handleProgramClick = (programId: string, programName: string) => {
    form.setValue("id", programId)
    form.setValue("name", programName)
  }

  const onSubmit = async (values: AddProgramFormSchema) => {
    setSubmitting(true)
    lottieRef.current?.play()

    await addProgramToCalendar(values)
      .then(data => {
        calendar.addEvents(data)
        toast.success("Success", {
          description: `Program "${values.name}" has been added successfully`
        })
        onOpenChange(false)
      })
      .catch(error => {
        toast.error("Error", {
          description: error.message
        })
      })

    lottieRef.current?.goToAndStop(0)
    setSubmitting(false)
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-y-4">
        <FormField 
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 w-[240px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={submitting}
                    >
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Label className="mb-1.5">Name Filter</Label>
          <Input value={nameFilter} onChange={e => setNameFilter(e.target.value)} disabled={submitting}/>
        </div>
        <div>
          <Label htmlFor="tag-ids-filter" className="mb-1.5">Tags</Label>
          <MultiSelect
            id="tag-ids-filter"
            options={programTags.map(tag => ({ label: tag.name, value: tag.id}))}
            maxCount={3}
            onValueChange={setTagIdsFilter}
            className="dark:bg-input/30"
            disabled={submitting}
          />
        </div>
        <div
          ref={parentRef}
          className="h-86 relative w-full overflow-auto mask-b-from-95% mask-t-from-95%"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative"
            }}
          >
            {virtualizer.getVirtualItems().map(virtualItem => (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height:"85px",
                  width: "100%",
                  transform: `translateY(${virtualItem.start})`
                }}
                className={cn(
                  "py-1 border-b hover:bg-accent flex flex-col justify-center",
                  filteredPrograms[virtualItem.index].id === form.watch("id") && "bg-neutral-600 hover:bg-neutral-700"
                )}
                onClick={() => handleProgramClick(filteredPrograms[virtualItem.index].id, filteredPrograms[virtualItem.index].name)}
              >
                <div className="text-lg font-medium w-full truncate">
                  {filteredPrograms[virtualItem.index].name}
                </div>
                <div className="w-full truncate">
                  {filteredPrograms[virtualItem.index].tags.map(tag => (
                    <Badge key={tag.id} className="mr-1">{tag.name}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {submitting && <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-50 pointer-events-auto" />}
        </div>
        <Button className="w-full" disabled={submitting || form.watch("name").length < 1} onClick={form.handleSubmit(onSubmit)} >
            {submitting ? "Adding Program..." : "Add Program" }
            <Lottie 
              lottieRef={lottieRef}
              animationData={shapeAnimation} 
              style={{ width: "5%", height: "100%" }} 
              loop={true} 
              autoplay={false}
            />
          </Button>
      </form>
    </Form>
  )
}