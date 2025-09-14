import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useListCountries, useListSubdivisions } from "@/lib/use-holidays";
import { useMemo } from "react";

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
		language: value.languageMode === "english" ? "en" : undefined,
	});

	const { data: subdivisions } = useListSubdivisions(value.countryIsoCode, {
		enabled: Boolean(value.countryIsoCode),
		language: value.languageMode === "english" ? "en" : undefined,
	});

	const selectedCountryObj = useMemo(
		() => countries?.find((c) => c.isoCode === value.countryIsoCode) ?? null,
		[countries, value.countryIsoCode],
	);

	function emit(next: Partial<CountrySubdivisionSelection>) {
		const newValue: CountrySubdivisionSelection = {
			countryIsoCode: next.countryIsoCode ?? value.countryIsoCode,
			subdivisionCode: next.subdivisionCode ?? value.subdivisionCode,
			languageMode: next.languageMode ?? value.languageMode,
		};
		onChange?.(newValue);
	}

	const countryLabel = useMemo(() => {
		if (!value.countryIsoCode) return "Select country";
		const match = countries?.find((c) => c.isoCode === value.countryIsoCode);
		if (!match) return value.countryIsoCode;
		const preferredLangs: string[] =
			value.languageMode === "native"
				? match.officialLanguages?.length
					? match.officialLanguages
					: ["en"]
				: ["en"];
		const nameByPreferred = match.name?.find((n) =>
			preferredLangs.some(
				(l) => n.language?.toLowerCase?.() === l.toLowerCase?.(),
			),
		);
		return (
			nameByPreferred?.text ?? match.name?.[0]?.text ?? value.countryIsoCode
		);
	}, [countries, value.countryIsoCode, value.languageMode]);

	const subdivisionLabel = useMemo(() => {
		if (!value.subdivisionCode) return "Select subdivision";
		const match = subdivisions?.find((s) => s.code === value.subdivisionCode);
		if (!match) return value.subdivisionCode;
		const preferredLangs: string[] =
			value.languageMode === "native"
				? selectedCountryObj?.officialLanguages?.length
					? selectedCountryObj.officialLanguages
					: ["en"]
				: ["en"];
		const nameByPreferred = match.name?.find((n) =>
			preferredLangs.some(
				(l) => n.language?.toLowerCase?.() === l.toLowerCase?.(),
			),
		);
		return (
			match.shortName ??
			nameByPreferred?.text ??
			match.name?.[0]?.text ??
			value.subdivisionCode
		);
	}, [
		subdivisions,
		value.subdivisionCode,
		value.languageMode,
		selectedCountryObj,
	]);

	return (
		<div className="flex items-center gap-3">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">{countryLabel}</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="max-h-80 w-64">
					{countries?.map((c) => (
						<DropdownMenuItem
							key={c.isoCode}
							onSelect={() => {
								emit({ countryIsoCode: c.isoCode, subdivisionCode: null });
							}}
						>
							{(() => {
								const preferredLangs: string[] =
									value.languageMode === "native"
										? c.officialLanguages?.length
											? c.officialLanguages
											: ["en"]
										: ["en"];
								const nameByPreferred = c.name?.find((n) =>
									preferredLangs.some(
										(l) => n.language?.toLowerCase?.() === l.toLowerCase?.(),
									),
								);
								return nameByPreferred?.text ?? c.name?.[0]?.text ?? c.isoCode;
							})()}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{value.countryIsoCode ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">{subdivisionLabel}</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="max-h-80 w-72">
						{subdivisions?.map((s) => (
							<DropdownMenuItem
								key={s.code}
								onSelect={() => {
									emit({ subdivisionCode: s.code });
								}}
							>
								{(() => {
									const preferredLangs: string[] =
										value.languageMode === "native"
											? selectedCountryObj?.officialLanguages?.length
												? selectedCountryObj.officialLanguages
												: ["en"]
											: ["en"];
									const nameByPreferred = s.name?.find((n) =>
										preferredLangs.some(
											(l) => n.language?.toLowerCase?.() === l.toLowerCase?.(),
										),
									);
									return nameByPreferred?.text ?? s.name?.[0]?.text ?? s.code;
								})()}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			) : null}
		</div>
	);
}
