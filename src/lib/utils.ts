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
