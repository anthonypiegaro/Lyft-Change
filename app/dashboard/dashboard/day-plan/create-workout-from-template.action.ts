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

export const createWorkoutFromTemplate = async (templateId: string): Promise<{ instanceId: string }> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/sign-in")
  }

  const userId = session.user.id

  const date = new Date()

  const instanceId = await db.transaction(async tx => {
    const workoutTemplateRes = await tx.select({ name: workout.name }).from(workout).where(eq(workout.id, templateId))

    const workoutInstanceRes = await tx.insert(workoutInstance).values({
      userId: userId,
      name: workoutTemplateRes[0].name,
      date: date.toISOString().slice(0, 10)
    }).returning({ id: workoutInstance.id })

    const workoutInstanceId = workoutInstanceRes[0].id

    const exercises = await tx
      .select({
        id: exerciseTemplate.id,
        exerciseId: exerciseTemplate.exerciseId,
        exerciseType: exerciseType.name,
        notes: exerciseTemplate.notes,
        orderNumber: exerciseTemplate.orderNumber
      })
      .from(exerciseTemplate)
      .leftJoin(exercise, eq(exerciseTemplate.exerciseId, exercise.id))
      .leftJoin(exerciseType, eq(exercise.typeId, exerciseType.id))
      .where(eq(exerciseTemplate.workoutId, templateId))

    for (const exerciseTemp of exercises) {
      const exerciseInstanceRes = await tx.insert(exerciseInstance).values({
        userId: userId,
        exerciseId: exerciseTemp.exerciseId,
        workoutInstanceId: workoutInstanceId,
        notes: exerciseTemp.notes,
        orderNumber: exerciseTemp.orderNumber
      }).returning({ id: exerciseInstance.id })

      const exerciseInstanceId = exerciseInstanceRes[0].id

      if (exerciseTemp.exerciseType === "weightReps") {
        const templateSets = await tx.select().from(setTemplate).where(eq(setTemplate.exerciseTemplateId, exerciseTemp.id))

        for (const templateSet of templateSets) {
          const setInstanceRes = await tx.insert(setInstance).values({
            exerciseInstanceId: exerciseInstanceId,
            orderNumber: templateSet.orderNumber
          }).returning({ id: setInstance.id })

          const setInstanceId = setInstanceRes[0].id

          const weightRepsTemplateRes = await tx.select().from(weightRepsTemplate).where(eq(weightRepsTemplate.setTemplateId, templateSet.id))

          await tx.insert(weightRepsInstance).values({
            setInstanceId: setInstanceId,
            weight: weightRepsTemplateRes[0].weight,
            reps: weightRepsTemplateRes[0].reps
          })
        }

      } else if (exerciseTemp.exerciseType === "timeDistance") {
        const templateSets = await tx.select().from(setTemplate).where(eq(setTemplate.exerciseTemplateId, exerciseTemp.id))

        for (const templateSet of templateSets) {
          const setInstanceRes = await tx.insert(setInstance).values({
            exerciseInstanceId: exerciseInstanceId,
            orderNumber: templateSet.orderNumber
          }).returning({ id: setInstance.id })

          const setInstanceId = setInstanceRes[0].id

          const timeDistanceTemplateRes = await tx.select().from(timeDistanceTemplate).where(eq(timeDistanceTemplate.setTemplateId, templateSet.id))

          await tx.insert(timeDistanceInstance).values({
            setInstanceId: setInstanceId,
            time: timeDistanceTemplateRes[0].time,
            distance: timeDistanceTemplateRes[0].distance
          })
        }

      } else {
        throw new Error("Invalid Exercise Type")
      }
    }

    return workoutInstanceId
  })

  return { instanceId }
}