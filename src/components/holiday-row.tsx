import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useWindowVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import {
	differenceInCalendarDays,
	format,
	formatDistanceToNowStrict,
	isAfter,
	isBefore,
	isWithinInterval,
} from "date-fns";

export interface SchoolHolidayLite {
	startDate?: Date | null;
	endDate?: Date | null;
	name?: { text?: string | null }[] | null;
	comment?: { text?: string | null }[] | null;
	subdivisions?: { code: string }[] | null;
}

type HolidayStatus = "ongoing" | "upcoming" | "past" | "unknown";

interface HolidayStatusStyles {
	label: string;
	accent: string;
	badge: string;
}

const STATUS_STYLES: Record<HolidayStatus, HolidayStatusStyles> = {
	ongoing: {
		label: "Ongoing",
		accent: "border-l-4 border-l-emerald-500",
		badge:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
	},
	upcoming: {
		label: "Upcoming",
		accent: "border-l-4 border-l-blue-500",
		badge:
			"bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
	},
	past: {
		label: "Past",
		accent: "border-l-4 border-l-slate-400",
		badge:
			"bg-slate-200 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
	},
	unknown: {
		label: "",
		accent: "border-l-4 border-l-muted",
		badge: "bg-muted text-muted-foreground",
	},
};

function getHolidayStatus(holiday: SchoolHolidayLite, now: Date): HolidayStatus {
	if (holiday.startDate && holiday.endDate) {
		if (
			isWithinInterval(now, {
				start: holiday.startDate,
				end: holiday.endDate,
			})
		) {
			return "ongoing";
		}
		if (isAfter(holiday.startDate, now)) {
			return "upcoming";
		}
		if (isBefore(holiday.endDate, now)) {
			return "past";
		}
	}
	return "unknown";
}

function getHolidayMeta(holiday: SchoolHolidayLite, status: HolidayStatus) {
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
}

function getHolidayDateInfo(holiday: SchoolHolidayLite) {
	if (!holiday.startDate || !holiday.endDate) {
		return { range: null, days: null } as const;
	}
	const range = `${format(holiday.startDate, "EEE, MMM d, yyyy")} – ${format(
		holiday.endDate,
		"EEE, MMM d, yyyy",
	)}`;
	const days =
		differenceInCalendarDays(holiday.endDate, holiday.startDate) + 1;
	return { range, days } as const;
}

export interface HolidayRowProps {
	holiday: SchoolHolidayLite;
	virtualItem: VirtualItem;
	virtualizer: ReturnType<typeof useWindowVirtualizer>;
	subdivisionNames: Map<string, string>;
}

export default function HolidayRow({
	holiday,
	virtualItem,
	virtualizer,
	subdivisionNames,
}: HolidayRowProps) {
	const now = new Date();
	const status = getHolidayStatus(holiday, now);
	const styles = STATUS_STYLES[status];
	const { range, days } = getHolidayDateInfo(holiday);
	const meta = getHolidayMeta(holiday, status);

	return (
		<div
			ref={virtualizer.measureElement}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				transform: `translateY(${virtualItem.start - (virtualizer.options.scrollMargin ?? 0)}px)`,
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
							{range && (
								<div className="flex flex-wrap items-center gap-2">
									<span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
										{range}
									</span>
									{days && (
										<span className="inline-flex items-center rounded-md bg-secondary/70 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
											{days} days
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
									const display =
										subdivisionNames.get(subdivision.code) ?? subdivision.code;
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
							<div className="hidden sm:block">
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
									numberOfMonths={days && days > 31 ? 2 : 1}
									className="rounded-md border"
								/>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
