import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useListCountries, useListSubdivisions } from "@/lib/use-holidays";
import {
	preferredLanguagesForDisplay,
	preferenceToApiLanguage,
	pickBestLocalizedText,
} from "@/lib/language";

export interface CountrySubdivisionSelection {
	countryIsoCode: string | null;
	subdivisionCode: string | null;
	languageMode: "english" | "native";
}

interface Props {
	value: CountrySubdivisionSelection;
	onChange?: (value: CountrySubdivisionSelection) => void;
}

export default function CountrySubdivisionPicker({ value, onChange }: Props) {
    const { data: countries } = useListCountries({
        language: preferenceToApiLanguage(value.languageMode),
    });

    const { data: subdivisions } = useListSubdivisions(value.countryIsoCode, {
        enabled: Boolean(value.countryIsoCode),
        language: preferenceToApiLanguage(value.languageMode),
    });

	const selectedCountryObj = countries?.find((c) => c.isoCode === value.countryIsoCode) ?? null;

	function emit(next: Partial<CountrySubdivisionSelection>) {
		const newValue: CountrySubdivisionSelection = {
			countryIsoCode: next.countryIsoCode ?? value.countryIsoCode,
			subdivisionCode: next.subdivisionCode ?? value.subdivisionCode,
			languageMode: next.languageMode ?? value.languageMode,
		};
		onChange?.(newValue);
	}

    

	return (
		<div className="flex items-center gap-2 flex-wrap">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="max-w-[65vw] sm:max-w-none truncate">
						<span className="truncate">
							{(() => {
								if (!value.countryIsoCode) return "Select country";
								const match = countries?.find((c) => c.isoCode === value.countryIsoCode);
								if (!match) return value.countryIsoCode;
								const pref = preferredLanguagesForDisplay(
									value.languageMode,
									match.officialLanguages,
								);
								return (
									pickBestLocalizedText(match.name, pref) ?? value.countryIsoCode
								);
							})()}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="max-h-80 w-64 sm:w-72 overflow-y-auto"
				>
					{countries?.map((c) => (
						<DropdownMenuItem
							key={c.isoCode}
							onSelect={() => {
								emit({ countryIsoCode: c.isoCode, subdivisionCode: null });
							}}
						>
                            {(() => {
                                const pref = preferredLanguagesForDisplay(
                                    value.languageMode,
                                    c.officialLanguages,
                                );
                                return (
                                    pickBestLocalizedText(c.name, pref) ?? c.isoCode
                                );
                            })()}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{value.countryIsoCode ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="max-w-[65vw] sm:max-w-none truncate">
							<span className="truncate">
								{(() => {
									if (!value.subdivisionCode) return "Select subdivision";
									const match = subdivisions?.find((s) => s.code === value.subdivisionCode);
									if (!match) return value.subdivisionCode;
									const pref = preferredLanguagesForDisplay(
										value.languageMode,
										selectedCountryObj?.officialLanguages,
									);
									return (
										pickBestLocalizedText(match.name, pref) ?? match.shortName ?? value.subdivisionCode
									);
								})()}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="max-h-80 w-72 sm:w-80 overflow-y-auto"
					>
                                                {subdivisions?.map((s) => (
                                                        <DropdownMenuItem
                                                                key={s.code}
                                                                onSelect={() => {
                                                                        emit({ subdivisionCode: s.code });
                                                                }}
                                                        >
                                        {(() => {
                                                const pref = preferredLanguagesForDisplay(
                                                    value.languageMode,
                                                    selectedCountryObj?.officialLanguages,
                                                );
                                                return (
                                                    pickBestLocalizedText(s.name, pref) ?? s.shortName ?? s.code
                                                );
                                        })()}
                                                        </DropdownMenuItem>
                                                ))}
					</DropdownMenuContent>
				</DropdownMenu>
			) : null}
		</div>
	);
}
