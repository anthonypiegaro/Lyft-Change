import { z } from "zod"

export const signUpFormSchema = z.object({
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
        .refine((password) => /[a-z]/.test(password), {
          message: "Password must contain at least one lowercase letter",
        })
        .refine((password) => /[A-Z]/.test(password), {
          message: "Password must contain at least one uppercase letter",
        })
        .refine((password) => /[0-9]/.test(password), {
          message: "Password must contain at least one number",
        })
        .refine((password) => /[^a-zA-Z0-9]/.test(password), {
          message: "Password must contain at least one special character",
        })
});