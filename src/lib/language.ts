export type LanguagePreference = "english" | "native";

export function preferenceToApiLanguage(
  preference: LanguagePreference | null | undefined,
): string | undefined {
  return preference === "english" ? "en" : undefined;
}

export function normalizeLanguageCode(code?: string | null): string | null {
  if (!code) return null;
  return code.toLowerCase();
}

export function preferredLanguagesForDisplay(
  preference: LanguagePreference,
  officialLanguages?: string[] | null,
): string[] {
  if (preference === "english") return ["en"];
  const langs = (officialLanguages ?? []).map((l) => l.toLowerCase());
  return langs.length ? langs : ["en"];
}

export function pickBestLocalizedText<T extends { text?: string | null; language?: string | null }>(
  items: T[] | null | undefined,
  preferredLanguages: string[],
): string | null {
  if (!items?.length) return null;
  const preferred = preferredLanguages.map((l) => l.toLowerCase());
  const match = items.find((n) => {
    const lang = n.language?.toLowerCase();
    return lang ? preferred.includes(lang) : false;
  });
  return match?.text ?? items[0]?.text ?? null;
}


