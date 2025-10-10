import { Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
	return (
		<footer className="mt-16 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-5xl px-4 py-6">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<span>School Breaks</span>
						<span className="hidden sm:inline">•</span>
						<a
							href="https://www.openholidaysapi.org/en/"
							target="_blank"
							rel="noreferrer noopener"
							className="hover:text-foreground transition-colors"
						>
							Powered by OpenHolidays API
						</a>
					</div>
					<div className="flex items-center gap-2">
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="h-9 gap-2"
							aria-label="View on GitHub"
						>
							<a
								href="https://github.com/LuggaPugga/schoolbreaks"
								target="_blank"
								rel="noreferrer noopener"
							>
								<Github className="size-4" />
								<span className="hidden sm:inline">GitHub</span>
							</a>
						</Button>
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="h-9 gap-2"
							aria-label="API Documentation"
						>
							<a
								href="https://www.openholidaysapi.org/en/"
								target="_blank"
								rel="noreferrer noopener"
							>
								<BookOpen className="size-4" />
								<span className="hidden sm:inline">API Docs</span>
							</a>
						</Button>
					</div>
				</div>
			</div>
		</footer>
	);
}

