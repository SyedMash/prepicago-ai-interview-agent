"use server"

import { redirect } from "next/navigation"
import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache"
import { deleteFeedback } from "./feedback.action"


export const getInterviewsByUserId = async () => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/sign-in");

    const { data: interviews, error } = await supabase.from("interviews").select("*").eq("userId", user.id)

    if (error) {
        return []
    }

    return interviews
}

export const getInterviewsByOtherUserId = async () => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/sign-in");

    const { data: interviews, error } = await supabase.from("interviews").select("*").neq("userId", user.id).limit(6)

    if (error) {
        return []
    }

    return interviews
}

export const deleteInterview = async (id: string) => {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from("interviews").delete().eq("id", id)
        const { error: feedbackError } = await deleteFeedback(id)
        if (error || feedbackError) return { success: false, error: error || feedbackError }

        revalidatePath("/", "layout")
        return { success: true, message: "Interview deleted successfully" }
    } catch (error) {
        return { success: false, message: error }
    }
}

export const getInterviewById = async (id: string) => {
    const supabase = await createClient()
    try {
        const { data: interview, error } = await supabase.from("interviews").select("*").eq("id", id)
        if (error) return null

        return interview[0] as Interview
    } catch (error) {
        return console.error(error)
    }
}