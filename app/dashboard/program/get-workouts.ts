"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { workout, workoutTag, workoutToWorkoutTag } from "@/db/schema"
import { auth } from "@/lib/auth"