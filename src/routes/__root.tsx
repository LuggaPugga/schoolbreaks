import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/use-language";
import Footer from "@/components/footer";
import type { QueryClient } from "@tanstack/react-query";
import Analytics from "@/components/analytics";

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
			<body className="flex flex-col min-h-screen">
				<LanguageProvider>
					<ThemeProvider
						themes={["light", "dark"]}
						attribute="class"
						enableSystem
						storageKey="theme"
					>
						<div className="flex-1">
							<main className="mx-auto max-w-5xl px-4">{children}</main>
						</div>
						<Footer />
					</ThemeProvider>
				</LanguageProvider>
				<Scripts />
				<Analytics />
			</body>
		</html>
	);
}
