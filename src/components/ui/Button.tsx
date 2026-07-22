import type { ButtonHTMLAttributes, FC } from "react"
import { cn } from "@/utils/cn"
import { Spinner } from "./Spinner"

type ButtonVariant = "primary" | "secondary"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	readonly variant?: ButtonVariant
	readonly isLoading?: boolean
}

export const Button: FC<ButtonProps> = ({
	variant = "primary",
	isLoading = false,
	disabled,
	className,
	children,
	type = "button",
	...rest
}) => (
	<button
		type={type}
		disabled={disabled || isLoading}
		className={cn(
			"inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
			variant === "primary" &&
				"bg-accent text-accent-text hover:bg-accent-hover",
			variant === "secondary" &&
				"border border-border bg-surface-primary text-text-primary hover:bg-surface-secondary",
			className,
		)}
		{...rest}
	>
		{isLoading ? <Spinner size="sm" /> : children}
	</button>
)
