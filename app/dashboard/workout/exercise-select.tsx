"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Settings2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"

const mockExercises: ExerciseSelectExercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '3', name: 'Chest' },
      { id: '4', name: 'Compound' },
      { id: '5', name: 'Chest' },
      { id: '6', name: 'Compound' },
      { id: '7', name: 'Chest' },
      { id: '8', name: 'Compound' },
    ],
  },
  {
    id: '2',
    name: 'Dumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell FlyDumbbell FlyvvDumbbell FlyDumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell Fly v ',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '3',
    name: 'Push-Up',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '4',
    name: 'Pull-Up',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '5',
    name: 'Lat Pulldown',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '6',
    name: 'Seated Row',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '7',
    name: 'Barbell Squat',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '8',
    name: 'Leg Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '9',
    name: 'Lunges',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '10',
    name: 'Leg Extension',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '11',
    name: 'Leg Curl',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '12',
    name: 'Calf Raise',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '7', name: 'Calves' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '13',
    name: 'Deadlift',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '6', name: 'Legs' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '14',
    name: 'Romanian Deadlift',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '6', name: 'Legs' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '15',
    name: 'Overhead Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '16',
    name: 'Lateral Raise',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '17',
    name: 'Front Raise',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '18',
    name: 'Face Pull',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '5', name: 'Back' },
    ],
  },
  {
    id: '19',
    name: 'Bicep Curl',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '20',
    name: 'Hammer Curl',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '21',
    name: 'Triceps Pushdown',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '22',
    name: 'Triceps Overhead Extension',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '23',
    name: 'Dips',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '9', name: 'Arms' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '24',
    name: 'Plank',
    type: { id: '2', name: 'timeDistance' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '25',
    name: 'Crunch',
    type: { id: '2', name: 'timeDistance' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '26',
    name: 'Russian Twist',
    type: { id: '2', name: 'timeDistance' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '27',
    name: 'Mountain Climber',
    type: { id: '2', name: 'timeDistance' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '28',
    name: 'Bicycle Crunch',
    type: { id: '2', name: 'timeDistance' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '29',
    name: 'Hanging Leg Raise',
    type: { id: '2', name: 'timeDistance' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '30',
    name: "Farmer’s Walk",
    type: { id: '3', name: 'weightReps' },
    tags: [
      { id: '11', name: 'Grip' },
      { id: '6', name: 'Legs' },
    ],
  },
  {
    id: '31',
    name: 'Kettlebell Swing',
    type: { id: '3', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '5', name: 'Back' },
    ],
  },
  {
    id: '32',
    name: 'Turkish Get-Up',
    type: { id: '3', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '10', name: 'Abs' },
    ],
  },
  {
    id: '33',
    name: 'Box Jump',
    type: { id: '4', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '12', name: 'Explosive' },
    ],
  },
  {
    id: '34',
    name: 'Burpee',
    type: { id: '4', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '35',
    name: 'Jump Squat',
    type: { id: '4', name: 'weightReps' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '12', name: 'Explosive' },
    ],
  },
  {
    id: '36',
    name: 'Medicine Ball Slam',
    type: { id: '4', name: 'weightReps' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '12', name: 'Explosive' },
    ],
  },
  {
    id: '37',
    name: 'Sprint',
    type: { id: '5', name: 'timeDistance' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '38',
    name: 'Rowing',
    type: { id: '5', name: 'timeDistance' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '39',
    name: 'Cycling',
    type: { id: '5', name: 'timeDistance' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '40',
    name: 'Jump Rope',
    type: { id: '5', name: 'timeDistance' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '41',
    name: 'Stair Climber',
    type: { id: '5', name: 'timeDistance' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '42',
    name: 'Incline Treadmill Walk',
    type: { id: '5', name: 'timeDistance' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '43',
    name: 'Arnold Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '44',
    name: 'Reverse Fly',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '5', name: 'Back' },
    ],
  },
  {
    id: '45',
    name: 'Chest Press Machine',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '46',
    name: 'Cable Crossover',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '47',
    name: 'Incline Bench Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '48',
    name: 'Decline Bench Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '49',
    name: 'Close-Grip Bench Press',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '9', name: 'Arms' },
    ],
  },
  {
    id: '50',
    name: 'Preacher Curl',
    type: { id: '1', name: 'weightReps' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
];

export type ExerciseSelectExercise = {
  id: string
  name: string
  type: {
    id: string
    name: "weightReps" | "timeDistance"
  }
  tags: {
    id: string
    name: string
  }[]
}

const typeMap: Record<ExerciseSelectExercise["type"]["name"], string> = {
  "weightReps": "Weight Reps",
  "timeDistance": "Time Distance"
}

export function ExerciseSelect({
  exercises,
  tagOptions
}: {
  exercises: ExerciseSelectExercise[],
  tagOptions: { label: string, value: string }[]
}) {
  const parentRef = useRef(null)
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set<string>())

  // filters 

  const [nameFilter, setNameFilter] = useState<string>("")

  // the "type name" is used for the typeFilter
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set<string>(Object.keys(typeMap)))

  // a list of "tag ids" are used for the tagFilter
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const filteredExercises = useMemo(() => {
    return mockExercises
      .filter(exercise => exercise.name.toLowerCase().includes(nameFilter.toLowerCase()))
      .filter(exercise => typeFilter.has(exercise.type.name))
      .filter(exercise => tagFilter.every(
        tagId => exercise.tags.some(tag => tag.id === tagId)
      ))
  }, [nameFilter, typeFilter, tagFilter])

  const getItemKey = useCallback(
    (index: number) => filteredExercises[index].id,
    [filteredExercises]
  );

  const virtualizer = useVirtualizer({
    count: filteredExercises.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 85,
  })

  function handleSelect(id: string) {
    setSelectedExercises(prev => {
      const newSet = new Set(prev)

      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }

      return newSet
    })
  }

  function handleTypeFilterChange(type: string) {
    setTypeFilter(prev => {
      const newTypeFilter = new Set(prev)

      if (newTypeFilter.has(type)) {
        newTypeFilter.delete(type)
      } else {
        newTypeFilter.add(type)
      }

      return newTypeFilter
    })
  }

  return (
    <div className="h-full">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="flex w-full gap-2">
          <Input 
            value={nameFilter} 
            onChange={e => setNameFilter(e.target.value)}
            placeholder="Filter by name..."
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                Type
                <Settings2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.keys(typeMap).map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={typeFilter.has(type)}
                  onCheckedChange={() => handleTypeFilterChange(type)}
                >
                  {typeMap[type as ExerciseSelectExercise["type"]["name"]]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <MultiSelect 
            defaultValue={tagFilter} 
            onValueChange={setTagFilter} 
            options={tagOptions}
            className="max-w-sm dark:bg-input/30"
            placeholder="Filter by tags..."
          />
      </div>
      <div 
        className="overflow-auto h-64 md:h-80 lg:h-96 xl:h-[500px]" 
        ref={parentRef}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const exercise = filteredExercises[virtualItem.index]

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: "85px",
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className={cn(
                  "py-1 border-b hover:bg-accent flex flex-col",
                  selectedExercises.has(exercise.id) && "bg-neutral-600 hover:bg-neutral-700"
                )}
                onClick={() => handleSelect(exercise.id)}
              >
                <div className="text-lg font-medium truncate">{exercise.name}</div>
                <div className="text-muted-foreground text-sm truncate">{typeMap[exercise.type.name]}</div>
                <div className="truncate">
                  {exercise.tags.map(tag => (
                    <Badge key={tag.id} className="mr-1">{tag.name}</Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Button type="button" className="mt-4" disabled={selectedExercises.size < 1}>
        Add Exercise{selectedExercises.size > 1 && "s"}{selectedExercises.size > 1 && ` (${selectedExercises.size})`}
      </Button>
    </div>
  )
}