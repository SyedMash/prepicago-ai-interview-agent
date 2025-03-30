"use server"

import { redirect } from "next/navigation"
import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache"

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
        if (error) return { success: false, message: error }

        revalidatePath("/", "layout")
        return { success: false, message: "Interview deleted successfully" }
    } catch (error) {
        return { success: false, message: error }
    }
}