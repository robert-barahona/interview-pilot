import { useCallback, useEffect, useRef, useState } from "react"
import { DEFAULT_LANG } from "@/config/constants"
import type {
	SpeechRecognitionErrorEventLike,
	SpeechRecognitionEventLike,
	SpeechRecognitionLike,
} from "@/types/speechRecognitionTypes"

const DEFAULT_SILENCE_TIMEOUT_MS = 1500

interface UseSpeechRecognitionOptions {
	readonly lang?: string
	readonly silenceTimeoutMs?: number
	readonly onSilence?: (transcript: string) => void
}

interface UseSpeechRecognitionResult {
	readonly isSupported: boolean
	readonly isListening: boolean
	readonly transcript: string
	readonly error: string | null
	readonly start: () => void
	readonly stop: () => void
	readonly resetTranscript: () => void
}

const getSpeechRecognitionConstructor = () => {
	if (typeof window === "undefined") return undefined
	return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

export const useSpeechRecognition = ({
	lang = DEFAULT_LANG,
	silenceTimeoutMs = DEFAULT_SILENCE_TIMEOUT_MS,
	onSilence,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionResult => {
	const [isListening, setIsListening] = useState(false)
	const [transcript, setTranscript] = useState("")
	const [error, setError] = useState<string | null>(null)

	const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
	const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const transcriptRef = useRef("")
	const finishedBySilenceRef = useRef(false)
	const onSilenceRef = useRef(onSilence)
	onSilenceRef.current = onSilence

	const isSupported = Boolean(getSpeechRecognitionConstructor())

	const clearSilenceTimer = useCallback(() => {
		if (silenceTimerRef.current) {
			clearTimeout(silenceTimerRef.current)
			silenceTimerRef.current = null
		}
	}, [])

	const scheduleSilenceTimer = useCallback(() => {
		clearSilenceTimer()
		silenceTimerRef.current = setTimeout(() => {
			finishedBySilenceRef.current = true
			recognitionRef.current?.stop()
		}, silenceTimeoutMs)
	}, [clearSilenceTimer, silenceTimeoutMs])

	const resetTranscript = useCallback(() => {
		transcriptRef.current = ""
		setTranscript("")
	}, [])

	const stop = useCallback(() => {
		finishedBySilenceRef.current = false
		clearSilenceTimer()
		recognitionRef.current?.stop()
	}, [clearSilenceTimer])

	const start = useCallback(() => {
		const SpeechRecognitionConstructor = getSpeechRecognitionConstructor()
		if (!SpeechRecognitionConstructor) {
			setError("Speech recognition isn't supported in this browser.")
			return
		}

		clearSilenceTimer()
		finishedBySilenceRef.current = false
		transcriptRef.current = ""
		setTranscript("")
		setError(null)

		const recognition = new SpeechRecognitionConstructor()
		recognition.lang = lang
		recognition.continuous = true
		recognition.interimResults = true

		recognition.onresult = (event: SpeechRecognitionEventLike) => {
			const { results } = event
			const nextTranscript = Array.from(
				{ length: results.length },
				(_, index) => results[index]?.[0]?.transcript ?? "",
			).join("")

			transcriptRef.current = nextTranscript
			setTranscript(nextTranscript)
			scheduleSilenceTimer()
		}

		recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
			setError(event.error || "Speech recognition error.")
			setIsListening(false)
			clearSilenceTimer()
		}

		recognition.onend = () => {
			setIsListening(false)
			clearSilenceTimer()
			if (finishedBySilenceRef.current) {
				finishedBySilenceRef.current = false
				onSilenceRef.current?.(transcriptRef.current)
			}
		}

		recognitionRef.current = recognition
		setIsListening(true)
		recognition.start()
	}, [clearSilenceTimer, lang, scheduleSilenceTimer])

	useEffect(
		() => () => {
			clearSilenceTimer()
			recognitionRef.current?.abort()
		},
		[clearSilenceTimer],
	)

	return {
		isSupported,
		isListening,
		transcript,
		error,
		start,
		stop,
		resetTranscript,
	}
}
