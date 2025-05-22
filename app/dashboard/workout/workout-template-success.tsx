"use client"

import dynamic from "next/dynamic"
import { z } from "zod"

import successAnimation from "@/public/lottie/success-animation.json"

import { workoutFormSchema } from "./workout-form.schema"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
};

export function WorkoutTemplateSuccess({
  formValues
}: {
  formValues: z.infer<typeof workoutFormSchema>
}) {

  return (
    <div>
      <div className="w-full h-20">
        <Lottie 
          animationData={successAnimation} 
          style={{ width: "100%", height: "100%" }} 
          loop={true}
          autoplay
        />
      </div>
      <h1 className="text-xl font-medium text-center mb-4">Workout Template Successfully Created</h1>
      <h2 className="text-lg font-normal">{formValues.name}</h2>
      <h2 className="text-muted-foreground mb-4">{formValues.date.toLocaleDateString('en-US', options)}</h2>
      <h2 className="mb-2">Exercises</h2>
      <div className="flex flex-col gap-y-1">
        {formValues.exercises.map(exercise => (
          <div className="text-muted-foreground truncate">{exercise.sets.length} x {exercise.name}</div>
        ))}
      </div>
    </div>
  )
}