import { z } from "zod"

const questionSchema = z.object({
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
