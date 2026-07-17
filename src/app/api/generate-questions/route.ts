import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { NextResponse } from "next/server"
import { generatedQuestionsSchema } from "@/types/interviewTypes"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert technical interviewer. Given a job posting, generate a mock interview question set of 5 to 8 questions.

Rules:
- Mix "technical" and "behavioral" categories.
- Infer the seniority level from the posting and set the difficulty of each question accordingly.
- Give each question a short unique id (e.g. "q1", "q2").
- Questions must be directly relevant to the skills, technologies, and responsibilities in the posting.`

const requestQuestions = async (jobDescription: string) => {
	const response = await client.messages.parse({
		model: "claude-haiku-4-5",
		max_tokens: 4096,
		system: SYSTEM_PROMPT,
		messages: [{ role: "user", content: jobDescription }],
		output_config: { format: zodOutputFormat(generatedQuestionsSchema) },
	})

	return response.parsed_output
}

export const POST = async (request: Request) => {
	let jobDescription: string
	try {
		const body = await request.json()
		jobDescription =
			typeof body?.jobDescription === "string" ? body.jobDescription.trim() : ""
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body." },
			{ status: 400 },
		)
	}

	if (!jobDescription) {
		return NextResponse.json(
			{ error: "jobDescription is required." },
			{ status: 400 },
		)
	}

	try {
		const parsed = await requestQuestions(jobDescription)
		if (parsed) {
			return NextResponse.json(parsed)
		}
	} catch (error) {
		console.error("generate-questions: request failed", error)
	}

	return NextResponse.json(
		{ error: "Could not generate a valid set of questions. Please try again." },
		{ status: 502 },
	)
}
