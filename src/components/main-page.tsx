import HolidayRow, { type SchoolHolidayLite } from "@/components/holiday-row";
import CountrySubdivisionPicker from "@/components/country-picker";
import SettingsPicker from "@/components/settings-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useListCountries,
	useListSubdivisions,
	useSchoolHolidays,
} from "@/lib/use-holidays";
import useLanguagePreference from "@/lib/use-language";
import { preferenceToApiLanguage } from "@/lib/language";
import { normalizeSlug } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
	compareAsc, isBefore
} from "date-fns";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Github,
	Ellipsis,
	RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmptyState from "./empty-state";

const SKELETON_KEYS = ["loading-1", "loading-2", "loading-3"];
const SMALL_SCREEN_QUERY = "(max-width: 640px)";

export default function MainPage({
	country,
	subdivision,
	countryIsoCode,
	subdivisionCode,
}: {
	country?: string;
	subdivision?: string;
	countryIsoCode?: string | null;
	subdivisionCode?: string | null;
}) {
	const [languagePreference] = useLanguagePreference();
	const language = preferenceToApiLanguage(languagePreference);
	const navigate = useNavigate();

	const currentYear = new Date().getFullYear();
	const [viewYear, setViewYear] = useState<number>(currentYear);
	const start = new Date(viewYear, 0, 1);
	const end = new Date(viewYear, 11, 31);

	const { data: countries } = useListCountries({ language });

	const targetCountryIso = (() => {
		if (countryIsoCode) return countryIsoCode;
		if (!country || !countries?.length) return null;
		const incomingSlug = normalizeSlug(country);

		return (
			countries.find((c) =>
				c.name?.some((n) => n.text && normalizeSlug(n.text) === incomingSlug),
			)?.isoCode ?? null
		);
	})();

	const { data: allSubdivisions } = useListSubdivisions(targetCountryIso, {
		enabled: Boolean(targetCountryIso),
		language,
	});

	const targetSubdivisionCode = (() => {
		if (subdivisionCode) return subdivisionCode;
		if (!subdivision || !allSubdivisions?.length) return null;
		const incomingSlug = normalizeSlug(subdivision);

		return (
			allSubdivisions.find((s) =>
				s.name?.some((n) => n.text && normalizeSlug(n.text) === incomingSlug),
			)?.code ?? null
		);
	})();

	const {
		data: holidays,
		isLoading,
		isFetching,
	} = useSchoolHolidays(
		targetCountryIso,
		start,
		end,
		targetSubdivisionCode,
		language,
		{ enabled: Boolean(targetCountryIso) },
	);

	const sortedHolidays = (() => {
		if (!Array.isArray(holidays)) return [];
		
		const now = new Date();
		const includePast = viewYear !== currentYear;
		
		return holidays
			.filter((h) => {
				if (!h.startDate || !h.endDate) return true;
				if (!includePast && isBefore(h.endDate as Date, now)) return false;
				return true;
			})
			.sort((a, b) => {
				if (!a.startDate || !a.endDate) return 1;
				if (!b.startDate || !b.endDate) return -1;
				
				return compareAsc(a.startDate as Date, b.startDate as Date);
			});
	})();

	const listRef = useRef<HTMLDivElement | null>(null);

	const [isSmallScreen, setIsSmallScreen] = useState(false);
	useEffect(() => {
		const mql = window.matchMedia(SMALL_SCREEN_QUERY);
		const onChange = () => setIsSmallScreen(mql.matches);
		onChange();
		if (typeof mql.addEventListener === "function") {
			mql.addEventListener("change", onChange);
		} else if (typeof (mql as any).addListener === "function") {
			(mql as any).addListener(onChange);
		}
		return () => {
			if (typeof mql.removeEventListener === "function") {
				mql.removeEventListener("change", onChange);
			} else if (typeof (mql as any).removeListener === "function") {
				(mql as any).removeListener(onChange);
			}
		};
	}, []);

	const virtualizer = useWindowVirtualizer({
		count: sortedHolidays.length,
		estimateSize: () => (isSmallScreen ? 200 : 420),
		overscan: isSmallScreen ? 6 : 10,
		scrollMargin: listRef.current?.offsetTop ?? 0,
	});

	const subdivisionNames = new Map(
		(allSubdivisions ?? []).map((subdivision) => [
			subdivision.code,
			subdivision.name?.[0]?.text ?? subdivision.code,
		]),
	);

	const navigateForSelection = (nextCountryIso: string | null, nextSubdivisionCode: string | null) => {
		if (!nextCountryIso) {
			navigate({ to: "/" });
			return;
		}
		const countryObj = countries?.find((c) => c.isoCode === nextCountryIso);
		const countrySlug = countryObj
			? normalizeSlug(countryObj.name?.[0]?.text ?? nextCountryIso)
			: nextCountryIso.toLowerCase();
		if (nextSubdivisionCode) {
			const subObj = allSubdivisions?.find((s) => s.code === nextSubdivisionCode);
			const subSlug = subObj
				? normalizeSlug(subObj.name?.[0]?.text ?? nextSubdivisionCode)
				: nextSubdivisionCode.toLowerCase();
			navigate({
				to: "/$country/{-$subdivision}",
				params: { country: countrySlug, subdivision: subSlug },
			});
			return;
		}
		navigate({
			to: "/$country/{-$subdivision}",
			params: { country: countrySlug },
		});
	};

	const hasCountry = Boolean(targetCountryIso);
	const hasSubdivision = Boolean(targetSubdivisionCode);
	const isBusy = (isLoading || isFetching) && hasCountry;

	return (
		<div className="text-center px-4 sm:px-8">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 sm:pt-14 pb-4 sm:pb-8">
				<div className="text-left">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
						School Breaks
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Plan smarter with school holiday calendars
					</p>
				</div>
				<div className="flex items-center gap-2 mt-3 sm:mt-0 self-start sm:self-auto">
					<div className="sm:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="icon" aria-label="More actions">
									<Ellipsis className="size-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem asChild>
									<a
										href="https://github.com/LuggaPugga/schoolbreaks"
										target="_blank"
										rel="noreferrer noopener"
									>
										<Github className="size-4 mr-2" /> GitHub
									</a>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<a
										href="https://www.openholidaysapi.org/en/"
										target="_blank"
										rel="noreferrer noopener"
									>
										<BookOpen className="size-4 mr-2" /> API Docs
									</a>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="hidden sm:flex items-center gap-2">
						<Button
							asChild
							variant="outline"
							size="icon"
							aria-label="Open GitHub repository"
							title="GitHub Repository"
						>
							<a
								href="https://github.com/LuggaPugga/schoolbreaks"
								target="_blank"
								rel="noreferrer noopener"
							>
								<Github className="size-5" />
							</a>
						</Button>
						<Button
							asChild
							variant="outline"
							size="icon"
							aria-label="Open API documentation"
							title="OpenHolidays API"
						>
							<a
								href="https://www.openholidaysapi.org/en/"
								target="_blank"
								rel="noreferrer noopener"
							>
								<BookOpen className="size-5" />
							</a>
						</Button>
					</div>
					<ThemeToggle />
				</div>
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 sm:gap-4 mb-6">
				<CountrySubdivisionPicker
					value={{
						countryIsoCode: targetCountryIso,
						subdivisionCode: targetSubdivisionCode,
						languageMode: languagePreference,
					}}
					onChange={(next) => {
						const countryChanged = next.countryIsoCode !== targetCountryIso;
						const nextCountryIso = next.countryIsoCode ?? targetCountryIso;
						const nextSubdivision = countryChanged
							? null
							: next.subdivisionCode;
						navigateForSelection(nextCountryIso, nextSubdivision);
					}}
				/>
				<div className="flex items-center gap-2 sm:self-auto self-end flex-wrap justify-end">
					<SettingsPicker />
					<div className="flex items-center gap-1 ml-3">
						<span className="text-sm text-muted-foreground mr-1 hidden sm:inline">
							Year
						</span>
						<Button
							variant="outline"
							size="icon"
							aria-label="Previous year"
							onClick={() => setViewYear((y) => y - 1)}
							disabled={isFetching}
						>
							<ChevronLeft className="size-4" />
						</Button>
						<span className="min-w-12 text-sm font-medium tabular-nums">
							{viewYear}
						</span>
						<Button
							variant="outline"
							size="icon"
							aria-label="Next year"
							onClick={() => setViewYear((y) => y + 1)}
							disabled={isFetching}
						>
							<ChevronRight className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Reset to current year"
							onClick={() => setViewYear(currentYear)}
							title="Reset to current year"
							disabled={isFetching || viewYear === currentYear}
						>
							<RotateCcw className="size-4" />
						</Button>
					</div>
				</div>
			</div>

			{isBusy ? (
				<div className="space-y-4">
					{SKELETON_KEYS.map((key) => (
						<Card
							key={key}
							className="border border-muted-foreground/10 max-w-full"
						>
							<CardContent className="py-6">
								<div className="flex flex-col md:flex-row gap-6">
									<div className="flex-1 space-y-3 text-left">
										<Skeleton className="h-6 w-2/3" />
										<Skeleton className="h-4 w-1/2" />
										<div className="flex gap-2">
											<Skeleton className="h-5 w-24" />
											<Skeleton className="h-5 w-24" />
										</div>
									</div>
									<div className="hidden sm:block">
										<Skeleton className="h-64 w-[320px]" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : sortedHolidays.length > 0 ? (
				<div ref={listRef} className="w-full">
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{virtualizer.getVirtualItems().map((virtualItem) => (
							<HolidayRow
								key={`${virtualItem.key}-${isSmallScreen ? "sm" : "lg"}`}
								holiday={sortedHolidays[virtualItem.index] as SchoolHolidayLite}
								virtualItem={virtualItem}
								virtualizer={virtualizer}
								subdivisionNames={subdivisionNames}
							/>
						))}
					</div>
				</div>
			) : (
				<EmptyState
					hasCountry={hasCountry}
					hasSubdivision={hasSubdivision}
					viewYear={viewYear}
					setViewYear={setViewYear}
					navigateForSelection={navigateForSelection}
					currentYear={currentYear}
					targetCountryIso={targetCountryIso}
				/>
			)}
		</div>
	);
}
