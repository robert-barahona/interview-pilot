import type { FC, TextareaHTMLAttributes } from "react"
import { cn } from "@/utils/cn"

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea: FC<TextAreaProps> = ({ className, ...rest }) => (
	<textarea
		className={cn(
			"w-full resize-none rounded-lg border border-border bg-surface-primary px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 md:text-sm",
			className,
		)}
		{...rest}
	/>
)
