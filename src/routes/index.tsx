import MainPage from "@/components/main-page";
import { getLocation } from "@/lib/headers";
import { createFileRoute } from "@tanstack/react-router";
import { buildAbsoluteUrl } from "@/lib/utils";

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
	head: () => {
		const title = "School Breaks";
		const description = "Plan smarter with school holiday calendars.";
		const url = buildAbsoluteUrl("/");
		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: title,
			url,
			description,
		};
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ name: "og:title", content: title },
				{ name: "og:description", content: description },
				{ name: "og:url", content: url },
			],
			links: [{ rel: "canonical", href: url }],
			scripts: [
				{ type: "application/ld+json", children: JSON.stringify(jsonLd) },
			],
		};
	},
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
