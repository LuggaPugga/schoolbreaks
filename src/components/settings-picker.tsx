import useLanguagePreference from "@/lib/use-language";
import { Button } from "./ui/button";

export default function SettingsPicker() {
	const [languagePreference, setLanguagePreference] = useLanguagePreference();

	return (
		<div className="flex items-center gap-2 mr-2">
			<Button
				variant={languagePreference === "english" ? "default" : "outline"}
				onClick={() => {
					setLanguagePreference("english");
				}}
				className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
			>
				English
			</Button>
			<Button
				variant={languagePreference === "native" ? "default" : "outline"}
				onClick={() => {
					setLanguagePreference("native");
				}}
				className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
			>
				Native
			</Button>
		</div>
	);
}
