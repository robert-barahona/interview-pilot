import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { NextResponse } from "next/server"
import {
	answerEvaluationSchema,
	type Question,
	questionSchema,
} from "@/types/interviewTypes"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert technical interviewer evaluating a candidate's spoken answer during a mock interview.

Rules:
- Score the answer from 1 (very poor) to 10 (excellent) based on correctness, depth, and relevance to the question.
- List "improvements" as concrete, actionable points the candidate could apply for a stronger answer. If the answer is already good, return an empty array — never invent artificial suggestions.
- Write "briefFeedback" as a single short sentence, in the voice of a real interviewer, stating whether the answer was good or bad and briefly why (e.g. "Good, that's the correct way to update state with useState." or "Not quite right, a closure doesn't depend on that directly.").`

const requestEvaluation = async (question: Question, transcript: string) => {
	const response = await client.messages.parse({
		model: "claude-haiku-4-5",
		max_tokens: 1024,
		system: SYSTEM_PROMPT,
		messages: [
			{
				role: "user",
				content: `Question (${question.category}, ${question.difficulty}): ${question.text}\n\nCandidate's spoken answer transcript: ${transcript}`,
			},
		],
		output_config: { format: zodOutputFormat(answerEvaluationSchema) },
	})

	return response.parsed_output
}

export const POST = async (request: Request) => {
	let question: Question
	let transcript: string
	try {
		const body = await request.json()
		const parsedQuestion = questionSchema.safeParse(body?.question)
		if (!parsedQuestion.success) {
			return NextResponse.json(
				{ error: "question is required and must be valid." },
				{ status: 400 },
			)
		}
		question = parsedQuestion.data
		transcript =
			typeof body?.transcript === "string" ? body.transcript.trim() : ""
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body." },
			{ status: 400 },
		)
	}

	if (!transcript) {
		return NextResponse.json(
			{ error: "transcript is required." },
			{ status: 400 },
		)
	}

	try {
		const parsed = await requestEvaluation(question, transcript)
		if (parsed) {
			return NextResponse.json(parsed)
		}
	} catch (error) {
		console.error("evaluate-answer: request failed", error)
	}

	return NextResponse.json(
		{ error: "Could not evaluate the answer. Please try again." },
		{ status: 502 },
	)
}
