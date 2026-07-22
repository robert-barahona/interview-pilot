import type { FC } from "react"
import { cn } from "@/utils/cn"

interface ProgressBarProps {
	readonly value: number
	readonly max: number
	readonly className?: string
}

export const ProgressBar: FC<ProgressBarProps> = ({
	value,
	max,
	className,
}) => {
	const percentage =
		max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

	return (
		<div
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={max}
			className={cn(
				"h-2 w-full overflow-hidden rounded-full bg-surface-secondary",
				className,
			)}
		>
			<div
				className="h-full rounded-full bg-accent transition-all duration-300"
				style={{ width: `${percentage}%` }}
			/>
		</div>
	)
}
