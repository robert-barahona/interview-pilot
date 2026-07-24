import type { FC, PropsWithChildren } from "react"
import { cn } from "@/utils/cn"

interface CardProps extends PropsWithChildren {
	readonly className?: string
}

export const Card: FC<CardProps> = ({ className, children }) => (
	<div
		className={cn(
			"rounded-2xl border border-border bg-surface-primary p-6",
			className,
		)}
	>
		{children}
	</div>
)
