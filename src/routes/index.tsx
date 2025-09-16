import MainPage from "@/components/main-page";
import { getLocation } from "@/lib/headers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	loader: async () => {
		const res = await getLocation();
		const countryIsoCode = res.country ?? null;
		const subdivisionCode = res.country
			? `${res.country}-${res.countryRegion ?? res.region ?? null}`
			: null;
		return { countryIsoCode, subdivisionCode };
	},
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
	const { countryIsoCode, subdivisionCode } = Route.useLoaderData() as {
		countryIsoCode: string | null;
		subdivisionCode: string | null;
	};
	return (
		<MainPage
			countryIsoCode={countryIsoCode}
			subdivisionCode={subdivisionCode}
		/>
	);
}
