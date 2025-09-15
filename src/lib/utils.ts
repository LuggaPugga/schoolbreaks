import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function normalizeSlug(input: string): string {
	return input
		.toLowerCase()
		.replace(/\(.*?\)/g, "")
		.replace(/\s+/g, " ")
		.replace(/\bthe\b/g, "")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function getSiteOrigin(): string {
	if (typeof window !== "undefined" && window.location?.origin) {
		return window.location.origin;
	}
	const vercelUrl = (globalThis as any)?.process?.env?.VERCEL_PROJECT_PRODUCTION_URL as
		| string
		| undefined;
	if (vercelUrl) {
		return `https://${vercelUrl}`;
	}
	const siteUrl = (import.meta as any)?.env?.VITE_SITE_URL as string | undefined;
	return siteUrl || "http://localhost:3000";
}

export function buildAbsoluteUrl(pathname: string): string {
	const base = getSiteOrigin();
	if (!pathname) return base;
	if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
		return pathname;
	}
	if (pathname.startsWith("/")) {
		return `${base}${pathname}`;
	}
	return `${base}/${pathname}`;
}
