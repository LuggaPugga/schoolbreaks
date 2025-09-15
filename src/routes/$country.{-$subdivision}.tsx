import MainPage from "@/components/main-page";
import { createFileRoute } from "@tanstack/react-router";
import { buildAbsoluteUrl, normalizeSlug } from "@/lib/utils";

export const Route = createFileRoute("/$country/{-$subdivision}")({
	component: RouteComponent,
	head: ({ params }) => {
		const countrySlug = params.country ?? "";
		const subdivisionSlug = params.subdivision ?? "";
		const toTitle = (slug: string) =>
			slug
				.split("-")
				.filter(Boolean)
				.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
				.join(" ");
		const countryTitle = toTitle(countrySlug);
		const subdivisionTitle = subdivisionSlug ? toTitle(subdivisionSlug) : null;
		const pageTitle = subdivisionTitle
			? `School Breaks — ${countryTitle} (${subdivisionTitle})`
			: `School Breaks — ${countryTitle}`;
		const description = subdivisionTitle
			? `View school holiday calendars for ${countryTitle} (${subdivisionTitle}).`
			: `View school holiday calendars for ${countryTitle}.`;
		const path = subdivisionTitle
			? `/${normalizeSlug(countrySlug)}/${normalizeSlug(subdivisionSlug)}`
			: `/${normalizeSlug(countrySlug)}`;
		const url = buildAbsoluteUrl(path);
		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: pageTitle,
			url,
			description,
		};
		return {
			meta: [
				{ title: pageTitle },
				{ name: "description", content: description },
				{ name: "og:title", content: pageTitle },
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

function RouteComponent() {
	const { country, subdivision } = Route.useParams();
	return <MainPage country={country} subdivision={subdivision} />;
}
