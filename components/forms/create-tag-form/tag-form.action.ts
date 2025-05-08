"use server"

import { z } from "zod"
import { tagFormSchema } from "./tag-form.schema"

export const createTag = async (values: z.infer<typeof tagFormSchema>) => {
  // throw new Error(`Tag name "${values.name}" already exists`)
  
  if (values.type === "exercise") {
    console.log("Creating exercise tag")
  } else if (values.type === "workout") {
    console.log("Creating workout tag")
  } else if (values.type === "program") {
    console.log("Creating program")
  } else {
    throw new Error(`Tag type invalid: ${values.type}`)
  }
}