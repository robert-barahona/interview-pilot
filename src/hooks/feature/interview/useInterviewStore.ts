import { create } from "zustand"
import type { Answer, InterviewStatus, Question } from "@/types/interviewTypes"

interface InterviewStoreState {
	readonly jobDescription: string
	readonly questions: Question[]
	readonly answers: Answer[]
	readonly status: InterviewStatus
	readonly currentQuestionIndex: number
}

interface InterviewStoreActions {
	readonly setJobDescription: (jobDescription: string) => void
	readonly setQuestions: (questions: Question[]) => void
	readonly addAnswer: (answer: Answer) => void
	readonly nextQuestion: () => void
	readonly reset: () => void
}

type InterviewStore = InterviewStoreState & InterviewStoreActions

const initialState: InterviewStoreState = {
	jobDescription: "",
	questions: [],
	answers: [],
	status: "setup",
	currentQuestionIndex: 0,
}

export const useInterviewStore = create<InterviewStore>((set) => ({
	...initialState,
	setJobDescription: (jobDescription) => set({ jobDescription }),
	setQuestions: (questions) =>
		set({
			questions,
			answers: [],
			currentQuestionIndex: 0,
			status: "in_progress",
		}),
	addAnswer: (answer) =>
		set((state) => ({ answers: [...state.answers, answer] })),
	nextQuestion: () =>
		set((state) => {
			const nextIndex = state.currentQuestionIndex + 1
			const isLastQuestion = nextIndex >= state.questions.length
			return {
				currentQuestionIndex: nextIndex,
				status: isLastQuestion ? "completed" : state.status,
			}
		}),
	reset: () => set(initialState),
}))
