"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "../supabase/server"
import { redirect } from "next/navigation"

export const signInAction = async (values: Pick<AuthUser, "email" | "password">) => {
    const supabase = await createClient()

    try {

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password
        })
        if (error) {
            return { success: false, message: error.message }
        }
    } catch (error) {
        return { success: false, message: error as string }
    }

    revalidatePath("/", "layout")
    return { success: true, message: "User signed in successfully", redirect: "/" }
}

export const signUpAction = async (values: AuthUser) => {
    const supabase = await createClient()

    try {
        const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    displayName: values.name
                }
            }
        })

        if (error) {
            return { success: false, message: error.message }
        }
    } catch (error) {
        return { success: false, message: error as string }
    }

    revalidatePath("/", "layout")
    return { success: true, message: "User signed up successfully", redirect: "/sign-in" }
}

export const signOut = async () => {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/sign-in")
}