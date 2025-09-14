"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LanguagePreference = "english" | "native";

const LanguageContext = createContext<{
	language: LanguagePreference;
	setLanguage: React.Dispatch<React.SetStateAction<LanguagePreference>>;
} | null>(null);

export function LanguageProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [language, setLanguage] = useState<LanguagePreference>(() => {
		if (typeof window === "undefined") return "english";
		const stored = window.localStorage.getItem("language");
		return stored === "native" || stored === "english"
			? (stored as LanguagePreference)
			: "english";
	});

	useEffect(() => {
		try {
			window.localStorage.setItem("language", language);
		} catch {}
	}, [language]);

	const value = useMemo(() => ({ language, setLanguage }), [language]);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export default function useLanguagePreference() {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		throw new Error(
			"useLanguagePreference must be used within a LanguageProvider",
		);
	}
	return [ctx.language, ctx.setLanguage] as const;
}
