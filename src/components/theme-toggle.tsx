"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeToggle() {
	const { theme, setTheme, themes } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" aria-label="Toggle theme">
					<Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuLabel>Theme</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={theme}
					onValueChange={(v) => setTheme(v)}
				>
					<DropdownMenuRadioItem value="light">
						<Sun className="size-4" /> Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark">
						<Moon className="size-4" /> Dark
					</DropdownMenuRadioItem>
					{themes?.includes("system") ? (
						<DropdownMenuRadioItem value="system">
							<Monitor className="size-4" /> System
						</DropdownMenuRadioItem>
					) : null}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
