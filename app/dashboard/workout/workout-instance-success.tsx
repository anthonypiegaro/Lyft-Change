"use client"

import dynamic from "next/dynamic"
import { z } from "zod"
import { LottieRefCurrentProps } from "lottie-react"

import starAnimation from "@/public/lottie/star-animation.json"
import successAnimation from "@/public/lottie/success-animation.json"

import { WorkoutFormSchema } from "./workout-form.schema"
import { PersonalRecord } from "./workout-form"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
};

export function WorkoutInstanceSuccess({
  formValues,
  personalRecords
}: {
  formValues: WorkoutFormSchema
  personalRecords: PersonalRecord[]
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
      <h1 className="text-xl font-medium text-center mb-4">Workout Successfully Completed</h1>
      {personalRecords.length > 0 && (
        <h2 className="text-lg mb-2">Personal Records</h2>
      )}
      <div className="mb-4 relative">
        {personalRecords.map(record => (
          <div className="flex items-center text-muted-foreground">
            <Lottie 
              animationData={starAnimation}
              className="h-5 w-5"
              loop={false}
              autoplay
            />
            <p className="absolute left-5">{record}</p>
          </div>
        ))}
      </div>
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