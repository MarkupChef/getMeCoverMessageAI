export type Theme = "light" | "dark" | "system";

export type ResolvedTheme = Exclude<Theme, "system">;

export const THEME_STORAGE_KEY = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const THEME_DARK_MODE_QUERY = "(prefers-color-scheme: dark)";
export const DEFAULT_THEME: Theme = "system";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}
