import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    return NextResponse.json({ message: "Hello" }, { status: 200 })
}

export async function POST(request: NextRequest) {
    const { role, level, amount, techStack, userId } = await request.json()
    const supabase = await createClient()

    try {
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techStack}.
            The focus between behavioural and technical questions.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `})

        const interview = {
            role,
            level,
            techStack: techStack.split(","),
            userId,
            questions: JSON.parse(questions)
        }

        const { error } = await supabase.from("interviews").insert(interview)
        if (error) return NextResponse.json({ success: false, error }, { status: 500 })

        return NextResponse.json({ success: true, message: "Interview generated successfully" }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error }, { status: 500 })
    }
}