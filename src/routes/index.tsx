import MainPage from "@/components/main-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
	head: () => ({
		meta: [
			{ title: "School Breaks" },
			{
				name: "description",
				content: "Plan smarter with school holiday calendars.",
			},
			{ name: "og:title", content: "School Breaks" },
			{
				name: "og:description",
				content: "Plan smarter with school holiday calendars.",
			},
		],
	}),
});

function App() {
	return <MainPage />;
}
