import useLanguagePreference from "@/lib/use-language";
import { Button } from "./ui/button";

export default function SettingsPicker() {
	const [languagePreference, setLanguagePreference] = useLanguagePreference();

	return (
		<div className="flex items-center gap-2 mr-0 sm:mr-2">
			<Button
				variant={languagePreference === "english" ? "default" : "outline"}
				onClick={() => {
					setLanguagePreference("english");
				}}
				className="h-8 sm:h-9 px-3 sm:px-4 py-2 text-sm font-medium"
			>
				English
			</Button>
			<Button
				variant={languagePreference === "native" ? "default" : "outline"}
				onClick={() => {
					setLanguagePreference("native");
				}}
				className="h-8 sm:h-9 px-3 sm:px-4 py-2 text-sm font-medium"
			>
				Native
			</Button>
		</div>
	);
}
