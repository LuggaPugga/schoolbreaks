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
import { Search } from "lucide-react";
import { useState } from "react";

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
	const [countrySearch, setCountrySearch] = useState("");
	const [subdivisionSearch, setSubdivisionSearch] = useState("");

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

	const filteredCountries = countries?.filter((c) => {
		if (!countrySearch) return true;
		const pref = preferredLanguagesForDisplay(value.languageMode, c.officialLanguages);
		const name = pickBestLocalizedText(c.name, pref) ?? c.isoCode;
		return name.toLowerCase().includes(countrySearch.toLowerCase());
	});

	const filteredSubdivisions = subdivisions?.filter((s) => {
		if (!subdivisionSearch) return true;
		const pref = preferredLanguagesForDisplay(value.languageMode, selectedCountryObj?.officialLanguages);
		const name = pickBestLocalizedText(s.name, pref) ?? s.shortName ?? s.code;
		return name.toLowerCase().includes(subdivisionSearch.toLowerCase());
	});

	return (
		<div className="flex items-center gap-2 flex-wrap">
			<DropdownMenu onOpenChange={(open) => !open && setCountrySearch("")}>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="max-w-[65vw] sm:max-w-none truncate h-10">
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
					className="w-64 sm:w-72 p-0"
				>
					<div className="sticky top-0 p-2 bg-background border-b">
						<div className="relative">
							<Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search countries..."
								value={countrySearch}
								autoFocus
								onChange={(e) => setCountrySearch(e.target.value)}
								className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					</div>
					<div className="max-h-64 overflow-y-auto">
						{filteredCountries?.length ? (
							filteredCountries.map((c) => (
								<DropdownMenuItem
									key={c.isoCode}
									onSelect={() => {
										emit({ countryIsoCode: c.isoCode, subdivisionCode: null });
										setCountrySearch("");
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
							))
						) : (
							<div className="px-3 py-6 text-center text-sm text-muted-foreground">
								No countries found
							</div>
						)}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>

			{value.countryIsoCode ? (
				<DropdownMenu onOpenChange={(open) => !open && setSubdivisionSearch("")}>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="max-w-[65vw] sm:max-w-none truncate h-10">
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
						className="w-72 sm:w-80 p-0"
					>
						<div className="sticky top-0 p-2 bg-background border-b">
							<div className="relative">
								<Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
								<input
								autoFocus
									type="text"
									placeholder="Search subdivisions..."
									value={subdivisionSearch}
									onChange={(e) => setSubdivisionSearch(e.target.value)}
									className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
						</div>
						<div className="max-h-64 overflow-y-auto">
							{filteredSubdivisions?.length ? (
								filteredSubdivisions.map((s) => (
									<DropdownMenuItem
										key={s.code}
										onSelect={() => {
											emit({ subdivisionCode: s.code });
											setSubdivisionSearch("");
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
								))
							) : (
								<div className="px-3 py-6 text-center text-sm text-muted-foreground">
									No subdivisions found
								</div>
							)}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			) : null}
		</div>
	);
}
