import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CalendarX2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function EmptyState({ hasCountry, hasSubdivision, viewYear, setViewYear, navigateForSelection, currentYear, targetCountryIso }: { hasCountry: boolean, hasSubdivision: boolean, viewYear: number, setViewYear: Dispatch<SetStateAction<number>>, navigateForSelection: (country: string | null, subdivision: string | null) => void, currentYear: number, targetCountryIso: string | null }) {
	return (
        <div className="mt-8">
        <Card className="mx-auto border border-muted-foreground/10">
            <CardContent className="py-10">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="rounded-full bg-accent text-accent-foreground size-12 flex items-center justify-center shadow-sm">
                        <CalendarX2 className="size-6" />
                    </div>
                    <h2 className="text-xl font-semibold">No holidays found</h2>
                    <p className="text-sm text-muted-foreground max-w-prose">
                        {!hasCountry
                            ? "Select a country using the picker above to view school breaks."
                            : `No results for ${viewYear}${hasSubdivision ? " in the selected subdivision" : ""}. Try another year or adjust filters.`}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
);
}