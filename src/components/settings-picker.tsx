import { useSettings } from "@/lib/use-settings";
import { Button } from "./ui/button";

export default function SettingsPicker() {
	const { settings, updateSettings } = useSettings();

	return (
		<div className="flex items-center gap-2 mr-2">
			<Button
				variant={settings.languageMode === "english" ? "default" : "outline"}
				onClick={() => {
					updateSettings({ languageMode: "english" });
				}}
				className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
			>
				English
			</Button>
			<Button
				variant={settings.languageMode === "native" ? "default" : "outline"}
				onClick={() => {
					updateSettings({ languageMode: "native" });
				}}
				className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
			>
				Native
			</Button>
		</div>
	);
}
