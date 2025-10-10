import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarX2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function EmptyState({ hasCountry, hasSubdivision, viewYear, setViewYear, navigateForSelection, currentYear, targetCountryIso }: { hasCountry: boolean, hasSubdivision: boolean, viewYear: number, setViewYear: Dispatch<SetStateAction<number>>, navigateForSelection: (country: string | null, subdivision: string | null) => void, currentYear: number, targetCountryIso: string | null }) {
	return (
        <div className="mt-8 sm:mt-12">
        <Card className="mx-auto border border-muted-foreground/20 shadow-sm">
            <CardContent className="py-12 sm:py-16 px-6">
                <div className="flex flex-col items-center text-center gap-5 max-w-md mx-auto">
                    <div className="rounded-full bg-muted text-muted-foreground size-16 sm:size-20 flex items-center justify-center shadow-sm">
                        <CalendarX2 className="size-8 sm:size-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">No holidays found</h2>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {!hasCountry
                                ? "Select a country using the picker above to view school breaks."
                                : `No results for ${viewYear}${hasSubdivision ? " in the selected subdivision" : ""}. Try another year or adjust filters.`}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewYear((y) => y - 1)}
                            className="h-9"
                        >
                            <ChevronLeft className="size-4 mr-1" /> Previous year
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewYear((y) => y + 1)}
                            className="h-9"
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
                                className="h-9"
                            >
                                Clear subdivision
                            </Button>
                        )}
                        {viewYear !== currentYear && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewYear(currentYear)}
                                className="h-9"
                            >
                                <RotateCcw className="size-4 mr-1" /> This year
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);
}