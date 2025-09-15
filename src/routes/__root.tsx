import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { buildAbsoluteUrl, getSiteOrigin } from "@/lib/utils";

import appCss from "../styles.css?url";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/use-language";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => {
		const origin = getSiteOrigin();
		const siteName = "School Breaks";
		const title = siteName;
		const description = "Plan smarter with school holiday calendars.";
		const url = buildAbsoluteUrl("/");
		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: siteName,
			url: origin,
			potentialAction: {
				"@type": "SearchAction",
				target: `${origin}/?q={search_term_string}`,
				"query-input": "required name=search_term_string",
			},
		};
		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ title },
				{ name: "description", content: description },
				{ name: "og:type", content: "website" },
				{ name: "og:site_name", content: siteName },
				{ name: "og:title", content: title },
				{ name: "og:description", content: description },
				{ name: "og:url", content: url },
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
			],
			links: [
				{ rel: "canonical", href: url },
				{ rel: "stylesheet", href: appCss },
			],
			scripts: [
				{ type: "application/ld+json", children: JSON.stringify(jsonLd) },
			],
		};
	},

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<LanguageProvider>
					<ThemeProvider
						themes={["light", "dark"]}
						attribute="class"
						enableSystem
						storageKey="theme"
					>
						<main className="mx-auto max-w-5xl px-4">{children}</main>
					</ThemeProvider>
				</LanguageProvider>
				<Scripts />
				<Analytics />
			</body>
		</html>
	);
}
