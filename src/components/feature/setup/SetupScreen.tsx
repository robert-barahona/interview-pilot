"use client"

import type { FC } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { TextArea } from "@/components/ui/TextArea"
import { useGenerateInterview } from "@/hooks/feature/setup/useGenerateInterview"

export const SetupScreen: FC = () => {
	const {
		jobDescription,
		setJobDescription,
		isVoiceSupported,
		isGenerating,
		error,
		generateInterview,
	} = useGenerateInterview()

	return (
		<main className="flex flex-1 items-center justify-center p-4">
			<Card className="w-full max-w-2xl space-y-4">
				<div className="space-y-1">
					<h1 className="font-semibold text-text-primary text-xl">
						Interview Pilot
					</h1>
					<p className="text-sm text-text-secondary">
						Paste a job posting and get a voice-based mock interview tailored to
						it.
					</p>
				</div>

				{!isVoiceSupported && (
					<div className="rounded-lg border border-border bg-surface-secondary px-4 py-3 text-sm text-text-secondary">
						Your browser doesn't fully support voice recognition and speech
						playback. For the best experience, use Chrome or Edge.
					</div>
				)}

				<TextArea
					rows={10}
					placeholder="Paste the job posting here..."
					value={jobDescription}
					onChange={(event) => setJobDescription(event.target.value)}
					disabled={isGenerating}
				/>

				{error && (
					<div className="rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-danger text-sm">
						{error}
					</div>
				)}

				<Button
					onClick={generateInterview}
					isLoading={isGenerating}
					className="w-full"
				>
					Generate interview
				</Button>
			</Card>
		</main>
	)
}
