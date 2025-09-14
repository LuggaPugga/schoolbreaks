import { useQuery } from "@tanstack/react-query";
import { Holiday } from "open-holiday-js";

export function useListCountries(options?: { language?: string }) {
	const holiday = new Holiday();
	return useQuery({
		queryKey: ["countries", options?.language],
		queryFn: async () => await holiday.getCountries(options?.language),
		refetchOnWindowFocus: false,
	});
}

export function useListSubdivisions(
	countryIsoCode: string | null,
	options?: { enabled?: boolean; language?: string },
) {
	const holiday = new Holiday();
	return useQuery({
		queryKey: ["subdivisions", countryIsoCode, options?.language],
		queryFn: async () =>
			await holiday.getSubdivisions(
				countryIsoCode as string,
				options?.language,
			),
		enabled: Boolean(countryIsoCode) && (options?.enabled ?? true),
		refetchOnWindowFocus: false,
	});
}

export function useSchoolHolidays(
	countryIsoCode: string | null,
	startDate: Date,
	endDate: Date,
	subdivision?: string | null,
	language?: string,
	options?: { enabled?: boolean },
) {
	const holiday = new Holiday();
	return useQuery({
		queryKey: [
			"holidays",
			countryIsoCode,
			startDate?.toISOString?.() ?? String(startDate),
			endDate?.toISOString?.() ?? String(endDate),
			subdivision ?? null,
			language ?? null,
		],
		queryFn: async () =>
			await holiday.getSchoolHolidays(
				countryIsoCode as string,
				startDate,
				endDate,
				subdivision ?? undefined,
				language,
			),
		enabled: Boolean(countryIsoCode) && (options?.enabled ?? true),
		refetchOnWindowFocus: false,
	});
}

export function usePublicHolidays(
	countryIsoCode: string | null,
	startDate: Date,
	endDate: Date,
	subdivision?: string | null,
	language?: string,
	options?: { enabled?: boolean },
) {
	const holiday = new Holiday();
	return useQuery({
		queryKey: [
			"public-holidays",
			countryIsoCode,
			startDate?.toISOString?.() ?? String(startDate),
			endDate?.toISOString?.() ?? String(endDate),
			subdivision ?? null,
			language ?? null,
		],
		queryFn: async () =>
			await holiday.getPublicHolidays(
				countryIsoCode as string,
				startDate,
				endDate,
				subdivision ?? undefined,
				language,
			),
		enabled: Boolean(countryIsoCode) && (options?.enabled ?? true),
		refetchOnWindowFocus: false,
	});
}
