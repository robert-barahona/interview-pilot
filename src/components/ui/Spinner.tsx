import type { FC } from "react"
import { cn } from "@/utils/cn"

const SIZE_CLASSES: Record<SpinnerSize, string> = {
	sm: "size-4 border-2",
	md: "size-6 border-2",
	lg: "size-10 border-[3px]",
}

type SpinnerSize = "sm" | "md" | "lg"

interface SpinnerProps {
	readonly size?: SpinnerSize
	readonly className?: string
}

export const Spinner: FC<SpinnerProps> = ({ size = "md", className }) => (
	<span
		role="status"
		aria-label="Loading"
		className={cn(
			"inline-block animate-spin rounded-full border-border border-t-accent",
			SIZE_CLASSES[size],
			className,
		)}
	/>
)
