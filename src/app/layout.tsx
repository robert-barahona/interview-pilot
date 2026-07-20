import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type { FC, ReactNode } from "react"
import "../styles/globals.css"

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">{children}</body>
		</html>
	)
}
