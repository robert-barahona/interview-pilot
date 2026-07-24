import type { FC } from "react"
import { SetupForm } from "@/components/feature/setup/SetupForm"

const Home: FC = () => (
	<main className="flex flex-1 items-center justify-center p-4">
		<SetupForm />
	</main>
)

// biome-ignore lint/style/noDefaultExport: needed for pages
export default Home
