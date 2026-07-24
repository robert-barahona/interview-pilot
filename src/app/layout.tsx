import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "../styles/globals.css"
import type { FC, PropsWithChildren } from "react"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Interview Pilot",
	description: "AI-powered mock interview simulator",
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col bg-bg-primary">{children}</body>
		</html>
	)
}

// biome-ignore lint/style/noDefaultExport: needed for layout
export default RootLayout
