import { useCallback, useEffect, useState } from "react"
import { DEFAULT_LANG } from "@/config/constants"

interface UseSpeechSynthesisOptions {
	readonly lang?: string
}

interface UseSpeechSynthesisResult {
	readonly isSupported: boolean
	readonly isSpeaking: boolean
	readonly error: string | null
	readonly speak: (text: string) => Promise<void>
	readonly stop: () => void
}

export const useSpeechSynthesis = ({
	lang = DEFAULT_LANG,
}: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisResult => {
	const [isSpeaking, setIsSpeaking] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const isSupported =
		typeof window !== "undefined" && "speechSynthesis" in window

	const stop = useCallback(() => {
		if (isSupported) {
			window.speechSynthesis.cancel()
		}
		setIsSpeaking(false)
	}, [isSupported])

	const speak = useCallback(
		(text: string) =>
			new Promise<void>((resolve, reject) => {
				if (!isSupported) {
					const message = "Speech synthesis isn't supported in this browser."
					setError(message)
					reject(new Error(message))
					return
				}

				window.speechSynthesis.cancel()
				setError(null)

				const utterance = new SpeechSynthesisUtterance(text)
				utterance.lang = lang

				utterance.onstart = () => setIsSpeaking(true)

				utterance.onend = () => {
					setIsSpeaking(false)
					resolve()
				}

				utterance.onerror = (event) => {
					setIsSpeaking(false)
					if (event.error === "canceled" || event.error === "interrupted") {
						resolve()
						return
					}
					const message = event.error || "Speech synthesis error."
					setError(message)
					reject(new Error(message))
				}

				window.speechSynthesis.speak(utterance)
			}),
		[isSupported, lang],
	)

	useEffect(
		() => () => {
			if (isSupported) {
				window.speechSynthesis.cancel()
			}
		},
		[isSupported],
	)

	return { isSupported, isSpeaking, error, speak, stop }
}
