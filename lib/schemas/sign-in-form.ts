import { z } from "zod"

export const signInFormSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" })
        .max(254, { message: "Email has too many characters" }),
    password: z
        .string()
        .min(12, { message: "Password must be at least 12 characters long" })
        .max(100, { message: "Password is too long" })
});