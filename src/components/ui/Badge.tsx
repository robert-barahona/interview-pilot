import type { FC, PropsWithChildren } from "react"
import { cn } from "@/utils/cn"

type BadgeVariant = "neutral" | "accent"

interface BadgeProps extends PropsWithChildren {
	readonly variant?: BadgeVariant
	readonly className?: string
}

export const Badge: FC<BadgeProps> = ({
	variant = "neutral",
	className,
	children,
}) => (
	<span
		className={cn(
			"inline-flex items-center rounded-full px-2.5 py-1 font-medium text-xs",
			variant === "neutral" && "bg-surface-secondary text-text-secondary",
			variant === "accent" && "bg-accent/10 text-accent",
			className,
		)}
	>
		{children}
	</span>
)
