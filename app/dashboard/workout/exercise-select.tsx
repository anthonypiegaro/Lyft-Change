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
  tagOptions,
  onAdd
}: {
  exercises: ExerciseSelectExercise[]
  tagOptions: { label: string, value: string }[]
  onAdd: (exercises: ExerciseSelectExercise[]) => void
}) {
  const parentRef = useRef(null)
  const [selectedExercises, setSelectedExercises] = useState<ExerciseSelectExercise[]>([])

  // filters 

  const [nameFilter, setNameFilter] = useState<string>("")

  // the "type name" is used for the typeFilter
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set<string>(Object.keys(typeMap)))

  // a list of "tag ids" are used for the tagFilter
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const filteredExercises = useMemo(() => {
    return exercises
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

  function handleSelect(selectedExercise: ExerciseSelectExercise) {
    setSelectedExercises(prev => {
      if (prev.some(exercise => exercise.id === selectedExercise.id)) {
        return prev.filter(exercise => exercise.id !== selectedExercise.id)
      } else {
        return [...prev, selectedExercise]
      }
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
        className="overflow-auto h-64 md:h-80 lg:h-96 xl:h-[500px] mask-b-from-95% mask-t-from-95%" 
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
                  selectedExercises.some(selectedExercise => selectedExercise.id === exercise.id) && "bg-neutral-600 hover:bg-neutral-700"
                )}
                onClick={() => handleSelect(exercise)}
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
      <Button type="button" className="mt-4" disabled={selectedExercises.length < 1} onClick={() => onAdd(selectedExercises)}>
        Add Exercise{selectedExercises.length > 1 && "s"}{selectedExercises.length > 1 && ` (${selectedExercises.length})`}
      </Button>
    </div>
  )
}