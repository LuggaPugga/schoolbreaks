import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export interface Settings {
	/**
	 * english => force English where supported by the API/UI
	 * native  => prefer native/official languages of the selected country
	 */
	languageMode: "english" | "native";
}

const STORAGE_KEY = "school-breaks-settings";

const isBrowser = typeof window !== "undefined";

const defaultSettings: Settings = {
	languageMode: "english",
};

function readFromStorage(): Settings {
	if (!isBrowser) return defaultSettings;
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (!stored) return defaultSettings;
		const parsed = JSON.parse(stored) as Partial<Settings> | null;
		return {
			...defaultSettings,
			languageMode: parsed?.languageMode ?? defaultSettings.languageMode,
		};
	} catch (error) {
		console.warn("Failed to load settings from localStorage:", error);
		return defaultSettings;
	}
}

function writeToStorage(next: Settings) {
	if (!isBrowser) return;
	try {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ languageMode: next.languageMode }),
		);
	} catch (error) {
		console.warn("Failed to save settings to localStorage:", error);
	}
}

export function useSettings() {
	const ctx = useContext(SettingsContext);
	if (!ctx) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return ctx;
}

interface SettingsContextValue {
	settings: Settings;
	updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [settings, setSettings] = useState<Settings>(() => readFromStorage());

	useEffect(() => {
		if (!isBrowser) return;
		function onStorage(e: StorageEvent) {
			if (e.key === STORAGE_KEY) {
				setSettings(readFromStorage());
			}
		}
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const updateSettings = useCallback((newSettings: Partial<Settings>) => {
		setSettings((prev) => {
			const updated: Settings = { ...prev, ...newSettings };
			writeToStorage(updated);
			return updated;
		});
	}, []);

	const value = useMemo<SettingsContextValue>(
		() => ({ settings, updateSettings }),
		[settings, updateSettings],
	);

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}
