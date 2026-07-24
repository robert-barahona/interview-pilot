import { z } from "zod"
import type { ApiErrorResponse } from "@/types/apiTypes"

export const questionSchema = z.object({
	id: z.string(),
	text: z.string(),
	category: z.enum(["technical", "behavioral"]),
	difficulty: z.enum(["junior", "mid", "senior"]),
})

export type Question = z.infer<typeof questionSchema>
export type QuestionCategory = Question["category"]
export type QuestionDifficulty = Question["difficulty"]

export const generatedQuestionsSchema = z.object({
	questions: z.array(questionSchema).min(5).max(8),
})

export type GeneratedQuestions = z.infer<typeof generatedQuestionsSchema>
export type GenerateQuestionsResponse = GeneratedQuestions | ApiErrorResponse

export const answerEvaluationSchema = z.object({
	score: z.number().int().min(1).max(10),
	improvements: z.array(z.string()),
	briefFeedback: z.string(),
})

export interface Answer {
	questionId: string
	transcript: string
	score: number
	improvements: string[]
	briefFeedback: string
}

export type InterviewStatus = "setup" | "in_progress" | "completed"

export interface InterviewSession {
	jobDescription: string
	questions: Question[]
	answers: Answer[]
	status: InterviewStatus
}
