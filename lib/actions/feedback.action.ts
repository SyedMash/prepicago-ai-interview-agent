"use server"

import { generateObject } from "ai";
import { createClient } from "../supabase/server";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "../schemas/feedback.schema";

export const generateFeedback = async ({ interviewId, transcript, userId }: CreateFeedbackParams) => {
    const supabase = await createClient()

    try {
        const formattedTranscript = transcript.map((sentence: { role: string; content: string }) => (
            `- ${sentence.role}: ${sentence.content}\n`
        )).join("")

        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false
            }),
            schema: feedbackSchema,
            prompt: `
            You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            Transcript:
            ${formattedTranscript}
    
            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem-Solving**: Ability to analyze problems and propose solutions.
            - **Cultural & Role Fit**: Alignment with company values and job role.
            - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const feedback = {
            interviewId,
            userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment
        }

        const { data, error } = await supabase
            .from("feedbacks")
            .insert(feedback)
            .single()

        if (error) return { success: false, error }

        try {
            const { data: users, error: usersError } = await supabase
                .from("interviews")
                .select("userId")
                .eq("id", interviewId)
                .single();

            if (usersError) return { success: false, error: usersError }

            const updatedArray = [...(users["userId"] || []), userId]

            const { error: updatedError } = await supabase
                .from("interviews")
                .update({ userId: updatedArray })
                .eq("id", interviewId)

            if (updatedError) return { success: false, error: updatedError }

            return { success: true, data }
        } catch (error) {
            return { success: false, error }
        }
    } catch (error) {
        console.error(error)
        return { success: false, message: error }
    }
}

export const getFeedbackByInterviewId = async (interviewId: string) => {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from("feedbacks").select("*").eq("interviewId", interviewId)
        if (error) return { success: false, error }

        return { success: true, data: data[0] as Feedback }
    } catch (error) {
        console.error(error)
        return { success: false, error }
    }
}

export const deleteFeedBackByUserId = async (userId: string) => {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from("feedbacks").delete().eq("userId", userId)
        if (error) return { success: false, error }

        return { success: true, message: "Feedback deleted successfully" }
    } catch (error) {
        return { success: false, error }
    }
}