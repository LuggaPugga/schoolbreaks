import useLanguagePreference from "@/lib/use-language";
import { Button } from "./ui/button";

export default function SettingsPicker() {
	const [languagePreference, setLanguagePreference] = useLanguagePreference();

	return (
		<div className="flex items-center gap-1 mr-0 sm:mr-2">
			<div className="flex items-center bg-muted rounded-lg p-1">
				<Button
					variant={languagePreference === "english" ? "default" : "ghost"}
					onClick={() => {
						setLanguagePreference("english");
					}}
					size="sm"
					className="h-7 px-3 text-xs font-medium transition-all"
				>
					English
				</Button>
				<Button
					variant={languagePreference === "native" ? "default" : "ghost"}
					onClick={() => {
						setLanguagePreference("native");
					}}
					size="sm" 
					className="h-7 px-3 text-xs font-medium transition-all"
				>
					Native
				</Button>
			</div>
		</div>
	);
}
