import { useRouter } from "next/navigation"
import { useState } from "react"
import { useInterviewStore } from "@/hooks/feature/interview/useInterviewStore"
import { useSpeechRecognition } from "@/hooks/shared/useSpeechRecognition"
import { useSpeechSynthesis } from "@/hooks/shared/useSpeechSynthesis"
import type { GenerateQuestionsResponse } from "@/types/interviewTypes"

interface UseGenerateInterviewResult {
	readonly jobDescription: string
	readonly setJobDescription: (jobDescription: string) => void
	readonly isVoiceSupported: boolean
	readonly isGenerating: boolean
	readonly error: string | null
	readonly generateInterview: () => Promise<void>
}

export const useGenerateInterview = (): UseGenerateInterviewResult => {
	const router = useRouter()
	const jobDescription = useInterviewStore((state) => state.jobDescription)
	const setJobDescription = useInterviewStore(
		(state) => state.setJobDescription,
	)
	const setQuestions = useInterviewStore((state) => state.setQuestions)

	const { isSupported: isRecognitionSupported } = useSpeechRecognition()
	const { isSupported: isSynthesisSupported } = useSpeechSynthesis()
	const isVoiceSupported = isRecognitionSupported && isSynthesisSupported

	const [isGenerating, setIsGenerating] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const generateInterview = async () => {
		if (!jobDescription.trim()) {
			setError("Paste a job posting first")
			return
		}

		setError(null)
		setIsGenerating(true)

		try {
			const response = await fetch("/api/generate-questions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jobDescription }),
			})

			const data: GenerateQuestionsResponse = await response.json()

			if (!response.ok || !("questions" in data)) {
				throw new Error(
					"error" in data ? data.error : "Could not generate questions",
				)
			}

			setQuestions(data.questions)
			router.push("/interview")
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Something went wrong. Please try again",
			)
		} finally {
			setIsGenerating(false)
		}
	}

	return {
		jobDescription,
		setJobDescription,
		isVoiceSupported,
		isGenerating,
		error,
		generateInterview,
	}
}
