import { redirect } from "next/navigation"
import { createClient } from "../supabase/server"

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

