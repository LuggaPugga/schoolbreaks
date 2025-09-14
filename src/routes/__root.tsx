import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/use-language";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "School Breaks",
			},
			{
				name: "description",
				content: "Plan smarter with school holiday calendars.",
			},
			{ name: "og:type", content: "website" },
			{ name: "og:title", content: "School Breaks" },
			{
				name: "og:description",
				content: "Plan smarter with school holiday calendars.",
			},
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: "School Breaks" },
			{
				name: "twitter:description",
				content: "Plan smarter with school holiday calendars.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

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
