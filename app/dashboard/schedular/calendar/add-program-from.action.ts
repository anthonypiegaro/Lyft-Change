"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { 
  exercise,
  exerciseInstance,
  exerciseTemplate,
  exerciseType,
  program, 
  programWorkout, 
  setInstance, 
  setTemplate, 
  timeDistanceInstance, 
  timeDistanceTemplate, 
  weightRepsInstance, 
  weightRepsTemplate, 
  workout,
  workoutInstance
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { AddProgramFormSchema } from "./add-program-form"

export const addProgramToCalendar = async (values: AddProgramFormSchema): Promise<{ id: string, name: string, date: Date }[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const programRes = await db.select({ userId: program.userId}).from(program).where(eq(program.id, values.id))

  if (programRes[0].userId !== userId) {
    redirect("/403")
  }

  const workoutsRes = await db.select({
    workoutId: workout.id,
    workoutName: workout.name,
    workoutNotes: workout.notes,
    day: programWorkout.day
  })
  .from(programWorkout)
  .innerJoin(workout, eq(programWorkout.workoutId, workout.id))
  .where(eq(programWorkout.programId, values.id))

  const createdWorkouts = await db.transaction(async tx => {
    const workoutInstances: { id: string, name: string, date: Date }[] = []
  
    for (const workoutRes of workoutsRes) {

      const newDate = new Date(values.date)
      newDate.setDate(newDate.getDate() + workoutRes.day)

      const workoutInstanceRes = await tx
        .insert(workoutInstance)
        .values({
          userId: userId,
          name: workoutRes.workoutName,
          notes: workoutRes.workoutNotes,
          date: newDate.toISOString().slice(0, 10)
        })
        .returning({ 
          id: workoutInstance.id
        })

      const workoutInstanceId = workoutInstanceRes[0].id
      
      workoutInstances.push({
        id: workoutInstanceId,
        name: workoutRes.workoutName,
        date: newDate
      })

      const workoutExercises = await tx
        .select({
          id: exerciseTemplate.id,
          exerciseId: exerciseTemplate.exerciseId,
          type: exerciseType.name,
          notes: exerciseTemplate.notes,
          orderNumber: exerciseTemplate.orderNumber
        })
        .from(exerciseTemplate)
        .innerJoin(exercise, eq(exerciseTemplate.exerciseId, exercise.id))
        .innerJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
        .where(eq(exerciseTemplate.workoutId, workoutRes.workoutId))
      
      for (const workoutExercise of workoutExercises) {
        const exerciseInstanceRes = await tx
          .insert(exerciseInstance)
          .values({
            userId: userId,
            exerciseId: workoutExercise.exerciseId,
            workoutInstanceId: workoutInstanceId,
            notes: workoutExercise.notes,
            orderNumber: workoutExercise.orderNumber
          })
          .returning({ id: exerciseInstance.id })
        

        const exerciseInstanceId = exerciseInstanceRes[0].id

        const templateSets = await tx.select({
            id: setTemplate.id,
            orderNumber: setTemplate.orderNumber
          })
          .from(setTemplate)
          .where(eq(setTemplate.exerciseTemplateId, workoutExercise.id))
        
        for (const templateSet of templateSets) {
          const setInstanceRes = await tx
            .insert(setInstance)
            .values({
              exerciseInstanceId: exerciseInstanceId,
              orderNumber: templateSet.orderNumber
            })
            .returning({ id: setInstance.id })
          
          const setInstanceId = setInstanceRes[0].id
          
          if (workoutExercise.type === "weightReps") {

            const weightRepsTemplateRes = await tx
              .select({
                weight: weightRepsTemplate.weight,
                reps: weightRepsTemplate.reps
              })
              .from(weightRepsTemplate)
              .where(eq(weightRepsTemplate.setTemplateId, templateSet.id ))
            
            await tx.insert(weightRepsInstance).values({
              setInstanceId: setInstanceId,
              weight: weightRepsTemplateRes[0].weight,
              reps: weightRepsTemplateRes[0].reps
            })

          } else if (workoutExercise.type === "timeDistance") {
            const timeDistanceTemplateRes = await tx.select({
                time: timeDistanceTemplate.time,
                distance: timeDistanceTemplate.distance
              })
              .from(timeDistanceTemplate)
              .where(eq(timeDistanceTemplate.setTemplateId, templateSet.id))
            
            await tx.insert(timeDistanceInstance).values({
              setInstanceId: setInstanceId,
              time: timeDistanceTemplateRes[0].time,
              distance: timeDistanceTemplateRes[0].distance
            })

          } else {
            console.log(workoutExercise.type)
            throw new Error("Exercise not of valid type")

          }
        }
      }
    }

    return workoutInstances
  })

  return createdWorkouts
}