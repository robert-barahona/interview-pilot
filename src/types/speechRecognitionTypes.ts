export interface SpeechRecognitionEventLike extends Event {
	readonly resultIndex: number
	readonly results: SpeechRecognitionResultList
}

export interface SpeechRecognitionErrorEventLike extends Event {
	readonly error: string
	readonly message: string
}

export interface SpeechRecognitionLike extends EventTarget {
	continuous: boolean
	interimResults: boolean
	lang: string
	onresult: ((event: SpeechRecognitionEventLike) => void) | null
	onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
	onend: (() => void) | null
	start: () => void
	stop: () => void
	abort: () => void
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor
		webkitSpeechRecognition?: SpeechRecognitionConstructor
	}
}
