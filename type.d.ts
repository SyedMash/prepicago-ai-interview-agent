interface Interview {
    id: string
    userId: string
    role: string
    level: string
    techStack: string
    questions: string[]
    created_at: string
}

interface AuthUser {
    name: string
    email: string
    password: string
}

interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
}

interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
}

interface Feedback {
    id: string
    userId: string
    interviewId: string
    totalScore: string
    categoryScores: string
    strengths: string[]
    areasForImprovement: string[]
    finalAssessment: string
    created_at: string
}