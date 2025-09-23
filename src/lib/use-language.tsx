"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { LanguagePreference } from "./language";

const LanguageContext = createContext<{
	language: LanguagePreference;
	setLanguage: React.Dispatch<React.SetStateAction<LanguagePreference>>;
} | null>(null);

export function LanguageProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [language, setLanguage] = useState<LanguagePreference>("english");
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && !isInitialized) {
			const stored = window.localStorage.getItem("language");
			if (stored === "native" || stored === "english") {
				setLanguage(stored as LanguagePreference);
			}
			setIsInitialized(true);
		}
	}, [isInitialized]);

	useEffect(() => {
		if (isInitialized && typeof window !== "undefined") {
			window.localStorage.setItem("language", language);
		}
	}, [language, isInitialized]);

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
