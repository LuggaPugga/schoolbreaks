import CountrySubdivisionPicker from "@/components/country-picker";
import SettingsPicker from "@/components/settings-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useListCountries,
	useListSubdivisions,
	useSchoolHolidays,
} from "@/lib/use-holidays";
import useLanguagePreference from "@/lib/use-language";
import { normalizeSlug } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
	compareAsc,
	compareDesc,
	differenceInCalendarDays,
	format,
	formatDistanceToNowStrict,
	isAfter,
	isBefore,
	isWithinInterval,
} from "date-fns";
import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Github,
	RotateCcw,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

interface SchoolHolidayLite {
	startDate?: Date | null;
	endDate?: Date | null;
	name?: { text?: string | null }[] | null;
	comment?: { text?: string | null }[] | null;
	subdivisions?: { code: string }[] | null;
}

export default function MainPage({
	country,
	subdivision,
	countryIsoCode,
}: { country?: string; subdivision?: string; countryIsoCode?: string | null }) {
	const [languagePreference] = useLanguagePreference();
	const navigate = useNavigate();

	const currentYear = useMemo(() => new Date().getFullYear(), []);
	const [viewYear, setViewYear] = useState<number>(currentYear);
	const start = useMemo(() => new Date(viewYear, 0, 1), [viewYear]);
	const end = useMemo(() => new Date(viewYear, 11, 31), [viewYear]);
	const language = languagePreference === "english" ? "en" : undefined;

	const { data: countries } = useListCountries({ language });

	const targetCountryIso = useMemo(() => {
		if (countryIsoCode) return countryIsoCode;
		if (!country || !countries?.length) return null;
		const incomingSlug = normalizeSlug(country);

		return (
			countries.find((c) =>
				c.name?.some((n) => n.text && normalizeSlug(n.text) === incomingSlug),
			)?.isoCode ?? null
		);
	}, [countryIsoCode, country, countries]);

	const { data: allSubdivisions } = useListSubdivisions(targetCountryIso, {
		enabled: Boolean(targetCountryIso),
		language: languagePreference === "english" ? "en" : undefined,
	});

	const targetSubdivisionCode = useMemo(() => {
		if (!subdivision || !allSubdivisions?.length) return null;
		const incomingSlug = normalizeSlug(subdivision);

		return (
			allSubdivisions.find((s) =>
				s.name?.some((n) => n.text && normalizeSlug(n.text) === incomingSlug),
			)?.code ?? null
		);
	}, [subdivision, allSubdivisions]);

	const {
		data: holidays,
		isLoading,
		isFetching,
	} = useSchoolHolidays(
		targetCountryIso,
		start,
		end,
		targetSubdivisionCode,
		languagePreference === "english" ? "en" : undefined,
		{ enabled: Boolean(targetCountryIso) },
	);

	const sortedHolidays = useMemo(() => {
		if (!Array.isArray(holidays)) return [];
		const now = new Date();
		const dated = holidays.filter((h) => h.startDate && h.endDate);
		const undated = holidays.filter((h) => !h.startDate || !h.endDate);
		const ongoing = dated
			.filter((h) =>
				isWithinInterval(now, {
					start: h.startDate as Date,
					end: h.endDate as Date,
				}),
			)
			.sort((a, b) => compareAsc(a.endDate as Date, b.endDate as Date));
		const upcoming = dated
			.filter((h) => isAfter(h.startDate as Date, now))
			.sort((a, b) => compareAsc(a.startDate as Date, b.startDate as Date));
		const past = dated
			.filter((h) => isBefore(h.endDate as Date, now))
			.sort((a, b) => compareDesc(a.endDate as Date, b.endDate as Date));
		const includePast = viewYear !== currentYear;
		return [...ongoing, ...upcoming, ...(includePast ? past : []), ...undated];
	}, [holidays, viewYear, currentYear]);

	const listRef = useRef<HTMLDivElement | null>(null);

	const count = sortedHolidays.length;
	const virtualizer = useWindowVirtualizer({
		count,
		estimateSize: () => 400,
		overscan: 8,
		scrollMargin: listRef.current?.offsetTop ?? 0,
	});

	const subdivisionsByCode = useMemo(() => {
		return new Map((allSubdivisions ?? []).map((s) => [s.code, s]));
	}, [allSubdivisions]);

	function navigateForSelection(
		nextCountryIso: string | null,
		nextSubdivisionCode: string | null,
	) {
		if (!nextCountryIso) {
			navigate({ to: "/" });
			return;
		}
		const countryObj = countries?.find((c) => c.isoCode === nextCountryIso);
		const countrySlug = countryObj
			? normalizeSlug(countryObj.name?.[0]?.text ?? nextCountryIso)
			: nextCountryIso.toLowerCase();
		if (nextSubdivisionCode) {
			const subObj = allSubdivisions?.find(
				(s) => s.code === nextSubdivisionCode,
			);
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
	}

	const hasCountry = Boolean(targetCountryIso);
	const hasSubdivision = Boolean(targetSubdivisionCode);
	const skeletonKeys = useMemo(() => ["s1", "s2", "s3"], []);

	function statusOf(holiday: SchoolHolidayLite) {
		const now = new Date();
		if (holiday.startDate && holiday.endDate) {
			if (
				isWithinInterval(now, {
					start: holiday.startDate,
					end: holiday.endDate,
				})
			)
				return "ongoing" as const;
			if (isAfter(holiday.startDate, now)) return "upcoming" as const;
			if (isBefore(holiday.endDate, now)) return "past" as const;
		}
		return "unknown" as const;
	}

	function badgeFor(status: "ongoing" | "upcoming" | "past" | "unknown") {
		switch (status) {
			case "ongoing":
				return {
					label: "Ongoing",
					accent: "border-l-4 border-l-emerald-500",
					badge:
						"bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
				};
			case "upcoming":
				return {
					label: "Upcoming",
					accent: "border-l-4 border-l-blue-500",
					badge:
						"bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
				};
			case "past":
				return {
					label: "Past",
					accent: "border-l-4 border-l-slate-400",
					badge:
						"bg-slate-200 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
				};
			default:
				return {
					label: "",
					accent: "border-l-4 border-l-muted",
					badge: "bg-muted text-muted-foreground",
				};
		}
	}

	return (
		<div className="text-center">
			<div className="flex items-center justify-between gap-3 pt-14 pb-8">
				<div className="text-left">
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
						School Breaks
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Plan smarter with school holiday calendars
					</p>
				</div>
				<div className="flex items-center gap-2">
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
							href="https://openholidaysapi.org/"
							target="_blank"
							rel="noreferrer noopener"
						>
							<BookOpen className="size-5" />
						</a>
					</Button>
					<ThemeToggle />
				</div>
			</div>

			<div className="flex flex-row items-start justify-between mb-6">
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
				<div className="flex items-center gap-2">
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

			{(isLoading || isFetching) && hasCountry ? (
				<div className="space-y-4">
					{skeletonKeys.map((key) => (
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
									<div className="flex-shrink-0">
										<Skeleton className="h-64 w-[320px]" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : sortedHolidays.length > 0 ? (
				<div ref={listRef} className=" w-full">
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{virtualizer.getVirtualItems().map((item) => {
							const holiday = sortedHolidays[item.index] as SchoolHolidayLite;
							const formattedRange =
								holiday.startDate && holiday.endDate
									? `${format(holiday.startDate, "EEE, MMM d, yyyy")} – ${format(holiday.endDate, "EEE, MMM d, yyyy")}`
									: null;
							const daysCount =
								holiday.startDate && holiday.endDate
									? differenceInCalendarDays(
											holiday.endDate,
											holiday.startDate,
										) + 1
									: null;
							const status = statusOf(holiday);
							const styles = badgeFor(status);
							const meta = (() => {
								if (!holiday.startDate || !holiday.endDate) return null;
								if (status === "ongoing") {
									return `Ends in ${formatDistanceToNowStrict(holiday.endDate, { addSuffix: false })}`;
								}
								if (status === "upcoming") {
									return `Starts in ${formatDistanceToNowStrict(holiday.startDate, { addSuffix: false })}`;
								}
								if (status === "past") {
									return `Ended ${formatDistanceToNowStrict(holiday.endDate, { addSuffix: true })}`;
								}
								return null;
							})();
							return (
								<div
									key={item.key}
									ref={virtualizer.measureElement}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										transform: `translateY(${item.start - (virtualizer.options.scrollMargin ?? 0)}px)`,
									}}
								>
									<Card
										className={`transition-shadow hover:shadow-lg border border-muted-foreground/10 max-w-full ${styles.accent}`}
									>
										<CardContent>
											<div className="flex flex-col md:flex-row gap-6">
												<div className="flex-1 space-y-3 text-left">
													<div className="flex items-start justify-between gap-3">
														<CardTitle className="text-2xl font-bold text-primary tracking-tight">
															{holiday.name?.[0]?.text ?? "Unnamed Holiday"}
														</CardTitle>
														{styles.label && (
															<span
																className={`px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}
															>
																{styles.label}
															</span>
														)}
													</div>
													{holiday.comment?.[0]?.text && (
														<p className="text-sm text-muted-foreground">
															{holiday.comment[0].text}
														</p>
													)}
													{formattedRange && (
														<div className="flex flex-wrap items-center gap-2">
															<span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
																{formattedRange}
															</span>
															{daysCount && (
																<span className="inline-flex items-center rounded-md bg-secondary/70 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
																	{daysCount} days
																</span>
															)}
															{meta && (
																<span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
																	{meta}
																</span>
															)}
														</div>
													)}
													<div className="flex flex-wrap gap-2">
														{holiday.subdivisions?.map((subdivision) => {
															const full = subdivisionsByCode.get(
																subdivision.code,
															);
															const display =
																full?.name?.[0]?.text ?? subdivision.code;
															return (
																<div
																	key={subdivision.code}
																	className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground bg-secondary/70 px-2 py-0.5 rounded"
																>
																	<span className="font-medium">{display}</span>
																	<span className="text-muted-foreground">
																		({subdivision.code})
																	</span>
																</div>
															);
														})}
													</div>
												</div>
												{holiday.startDate && holiday.endDate && (
													<div className="flex-shrink-0">
														<Calendar
															mode="range"
															startMonth={holiday.startDate}
															endMonth={holiday.endDate}
															defaultMonth={holiday.startDate}
															ISOWeek
															selected={{
																from: holiday.startDate,
																to: holiday.endDate,
															}}
															fixedWeeks
															numberOfMonths={
																differenceInCalendarDays(
																	holiday.endDate,
																	holiday.startDate,
																) > 30
																	? 2
																	: 1
															}
															className="rounded-md border"
														/>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div className="mt-8">
					<Card className="max-w-2xl mx-auto border border-muted-foreground/10 text-left">
						<CardContent className="py-8">
							<div className="space-y-3">
								<h2 className="text-lg font-semibold">No holidays found</h2>
								<p className="text-sm text-muted-foreground">
									{!hasCountry
										? "Select a country to view school breaks."
										: `No results for ${viewYear}${hasSubdivision ? " in the selected subdivision" : ""}. Try other years or adjust filters.`}
								</p>
								<div className="flex flex-wrap items-center gap-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setViewYear((y) => y - 1)}
									>
										<ChevronLeft className="size-4 mr-1" /> Previous year
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setViewYear((y) => y + 1)}
									>
										Next year <ChevronRight className="size-4 ml-1" />
									</Button>
									{hasSubdivision && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												navigateForSelection(targetCountryIso, null)
											}
										>
											Clear subdivision
										</Button>
									)}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setViewYear(currentYear)}
										disabled={viewYear === currentYear}
									>
										<RotateCcw className="size-4 mr-1" /> This year
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
