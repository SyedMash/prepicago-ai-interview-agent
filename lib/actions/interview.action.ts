"use server"

import { redirect } from "next/navigation"
import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache"
import { deleteFeedBackByUserId } from "./feedback.action"


export const getInterviewsByUserId = async () => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/sign-in");

    const { data: interviews, error } = await supabase.from("interviews").select("*").contains("userId", [user.id])

    if (error) {
        return []
    }

    return interviews
}

export const getInterviewsByOtherUserId = async () => {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/sign-in");

    const { data: interviews, error } = await supabase.from("interviews").select("*").not("userId", "cs", `{${user.id}}`)

    if (error) {
        return []
    }

    return interviews
}

export const deleteInterview = async (id: string, currentUserId: string) => {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from("interviews")
            .select("userId")
            .eq("id", id)
            .single()

        if (error || !data) return { success: false, error: error || "Interview not found" }

        const { userId } = data;

        let newUser: string[] = [];

        if (userId.length >= 2) {
            if (userId.includes(currentUserId)) {
                newUser = userId.filter((id: string) => id !== currentUserId)


                const { error } = await supabase
                    .from("interviews")
                    .update({ userId: newUser })
                    .eq("id", id)

                const { error: feedbackError } = await deleteFeedBackByUserId(currentUserId)

                if (error || feedbackError) return { success: false, error: error || feedbackError }

                revalidatePath("/", "layout")
                return { success: true, message: "Interview deleted successfully from your account" }
            }
        } else {
            const { error } = await supabase
                .from("interviews")
                .delete()
                .eq("id", id)

            const { error: feedbackError } = await deleteFeedBackByUserId(currentUserId)
            if (error || feedbackError) return { success: false, error: error || feedbackError }

            revalidatePath("/", "layout")
            return { success: true, message: "Interview deleted successfully" }
        }

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