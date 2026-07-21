// Real answers can legitimately contain the word "repeat" (e.g. "you'd
// repeat that call on failure"), so patterns require request-like phrasing
// rather than the bare word, and are only trusted on short utterances —
// genuine repeat requests are brief, unlike substantive answers.
const MAX_REPEAT_REQUEST_WORDS = 12

const REPEAT_REQUEST_PATTERNS: readonly RegExp[] = [
	/\b(can|could|would) you (please )?repeat\b/,
	/\brepeat (that|this|it|the question|please)\b/,
	/\bsay (it|that) again\b/,
	/\bone more time\b/,
	/\bcome again\b/,
	/\b(didn'?t|did not) (hear|catch) (that|you)\b/,
	/\b(didn'?t|did not) understand (that|the question)\b/,
	/\bwhat was the question\b/,
	/\bpardon\b/,
]

export const detectRepeatRequest = (transcript: string): boolean => {
	const normalized = transcript.trim().toLowerCase()
	if (!normalized) return false

	const wordCount = normalized.split(/\s+/).length
	if (wordCount > MAX_REPEAT_REQUEST_WORDS) return false

	return REPEAT_REQUEST_PATTERNS.some((pattern) => pattern.test(normalized))
}
