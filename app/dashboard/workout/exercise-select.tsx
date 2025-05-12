"use client"

import { useCallback, useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { Badge } from "@/components/ui/badge"

const mockExercises: ExerciseSelectExercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '2',
    name: 'Dumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell FlyDumbbell FlyvvDumbbell FlyDumbbell Fly Dumbbell Fly Dumbbell Fly Dumbbell Fly v ',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '3',
    name: 'Push-Up',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '4',
    name: 'Pull-Up',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '5',
    name: 'Lat Pulldown',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '6',
    name: 'Seated Row',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '7',
    name: 'Barbell Squat',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '8',
    name: 'Leg Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '9',
    name: 'Lunges',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '10',
    name: 'Leg Extension',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '11',
    name: 'Leg Curl',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '12',
    name: 'Calf Raise',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '7', name: 'Calves' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '13',
    name: 'Deadlift',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '6', name: 'Legs' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '14',
    name: 'Romanian Deadlift',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '6', name: 'Legs' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '15',
    name: 'Overhead Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '16',
    name: 'Lateral Raise',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '17',
    name: 'Front Raise',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '18',
    name: 'Face Pull',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '5', name: 'Back' },
    ],
  },
  {
    id: '19',
    name: 'Bicep Curl',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '20',
    name: 'Hammer Curl',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '21',
    name: 'Triceps Pushdown',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '22',
    name: 'Triceps Overhead Extension',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '23',
    name: 'Dips',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '9', name: 'Arms' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '24',
    name: 'Plank',
    type: { id: '2', name: 'Core' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '25',
    name: 'Crunch',
    type: { id: '2', name: 'Core' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '26',
    name: 'Russian Twist',
    type: { id: '2', name: 'Core' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '27',
    name: 'Mountain Climber',
    type: { id: '2', name: 'Core' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '28',
    name: 'Bicycle Crunch',
    type: { id: '2', name: 'Core' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '29',
    name: 'Hanging Leg Raise',
    type: { id: '2', name: 'Core' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '30',
    name: 'Farmer’s Walk',
    type: { id: '3', name: 'Functional' },
    tags: [
      { id: '11', name: 'Grip' },
      { id: '6', name: 'Legs' },
    ],
  },
  {
    id: '31',
    name: 'Kettlebell Swing',
    type: { id: '3', name: 'Functional' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '5', name: 'Back' },
    ],
  },
  {
    id: '32',
    name: 'Turkish Get-Up',
    type: { id: '3', name: 'Functional' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '10', name: 'Abs' },
    ],
  },
  {
    id: '33',
    name: 'Box Jump',
    type: { id: '4', name: 'Plyometric' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '12', name: 'Explosive' },
    ],
  },
  {
    id: '34',
    name: 'Burpee',
    type: { id: '4', name: 'Plyometric' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '10', name: 'Abs' },
      { id: '4', name: 'Bodyweight' },
    ],
  },
  {
    id: '35',
    name: 'Jump Squat',
    type: { id: '4', name: 'Plyometric' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '12', name: 'Explosive' },
    ],
  },
  {
    id: '36',
    name: 'Medicine Ball Slam',
    type: { id: '4', name: 'Plyometric' },
    tags: [
      { id: '10', name: 'Abs' },
      { id: '12', name: 'Explosive' },
    ],
  },
  {
    id: '37',
    name: 'Sprint',
    type: { id: '5', name: 'Cardio' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '38',
    name: 'Rowing',
    type: { id: '5', name: 'Cardio' },
    tags: [
      { id: '5', name: 'Back' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '39',
    name: 'Cycling',
    type: { id: '5', name: 'Cardio' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '40',
    name: 'Jump Rope',
    type: { id: '5', name: 'Cardio' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '41',
    name: 'Stair Climber',
    type: { id: '5', name: 'Cardio' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '42',
    name: 'Incline Treadmill Walk',
    type: { id: '5', name: 'Cardio' },
    tags: [
      { id: '6', name: 'Legs' },
      { id: '13', name: 'HIIT' },
    ],
  },
  {
    id: '43',
    name: 'Arnold Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '44',
    name: 'Reverse Fly',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '8', name: 'Shoulders' },
      { id: '5', name: 'Back' },
    ],
  },
  {
    id: '45',
    name: 'Chest Press Machine',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '46',
    name: 'Cable Crossover',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '3', name: 'Isolation' },
    ],
  },
  {
    id: '47',
    name: 'Incline Bench Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '48',
    name: 'Decline Bench Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Compound' },
    ],
  },
  {
    id: '49',
    name: 'Close-Grip Bench Press',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '1', name: 'Chest' },
      { id: '9', name: 'Arms' },
    ],
  },
  {
    id: '50',
    name: 'Preacher Curl',
    type: { id: '1', name: 'Strength' },
    tags: [
      { id: '9', name: 'Arms' },
      { id: '3', name: 'Isolation' },
    ],
  }
]

export type ExerciseSelectExercise = {
  id: string
  name: string
  type: {
    id: string
    name: string
  }
  tags: {
    id: string
    name: string
  }[]
}

export function ExerciseSelect({
  exercises
}: {
  exercises: ExerciseSelectExercise[]
}) {
  const parentRef = useRef(null)

  const getItemKey = useCallback(
    (index: number) => mockExercises[index].id,
    [mockExercises]
  );

  const virtualizer = useVirtualizer({
    count: mockExercises.length,
    getScrollElement: () => parentRef.current,
    getItemKey,
    estimateSize: () => 85,
  })

  return (
    <div className="h-full">
      <div>
        Header and add button go here (dynamically show how many selected exercises)
      </div>
      <div>
        Filters go here
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
            const exercise = mockExercises[virtualItem.index]

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
                className="py-1 border-b hover:bg-accent flex flex-col"
              >
                <div className="text-lg font-medium truncate">{exercise.name}</div>
                <div className="text-muted-foreground text-sm truncate">{exercise.type.name}</div>
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
    </div>
  )
}