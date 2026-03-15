import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import { ThemeProvider } from "@/components/theme-provider";
import { getSiteUrl } from "@/lib/site-url";
import { LanguageProvider } from "@/lib/use-language";
import Footer from "@/components/footer";
import type { QueryClient } from "@tanstack/react-query";
import OnedollarAnalytics from "@/components/analytics";
import { Analytics } from "@faststats/react";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => {
		const siteUrl = getSiteUrl();
		return {
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
				{ property: "og:type", content: "website" },
				{ property: "og:title", content: "School Breaks" },
				{
					property: "og:description",
					content: "Plan smarter with school holiday calendars.",
				},
				{ property: "og:image", content: `${siteUrl}/og-image.png` },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: "School Breaks" },
				{
					name: "twitter:description",
					content: "Plan smarter with school holiday calendars.",
				},
				{ name: "twitter:image", content: `${siteUrl}/og-image.png` },
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
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
				<OnedollarAnalytics />
				<Analytics siteKey="b78c1a4bd51bce5e8fd591a876a4f9c2" trackErrors trackWebVitals/>
			</body>
		</html>
	);
}
