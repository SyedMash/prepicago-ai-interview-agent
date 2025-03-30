import * as z from "zod"

export const signInSchema = z.object({
    email: z.string().email().nonempty({ message: "Email is required" }),
    password: z.string().nonempty({ message: "Password is required" })
})

export const signUpSchema = z.object({
    name: z.string().nonempty({ message: "Username is required" }),
    email: z.string().email().nonempty({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).nonempty({ message: "Password is required" })
})