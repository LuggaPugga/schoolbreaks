export function getSiteUrl(): string {
	const vercelUrl =
		typeof process !== "undefined" &&
		process.env.VERCEL_PROJECT_PRODUCTION_URL;
	return vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
}
