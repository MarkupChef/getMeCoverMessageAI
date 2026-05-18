import {
  DEFAULT_THEME,
  THEME_COOKIE_MAX_AGE,
  THEME_DARK_MODE_QUERY,
  THEME_STORAGE_KEY,
} from "./theme-config";

export const THEME_INIT_SCRIPT_ID = "theme-init";

export function getThemeInitScript() {
  return `
(function() {
  var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  var defaultTheme = ${JSON.stringify(DEFAULT_THEME)};
  var darkModeQuery = ${JSON.stringify(THEME_DARK_MODE_QUERY)};
  var cookieMaxAge = ${THEME_COOKIE_MAX_AGE};
  var theme = defaultTheme;

  try {
    var cookieTheme = document.cookie
      .split("; ")
      .find(function(row) { return row.indexOf(storageKey + "=") === 0; });
    var storedTheme = window.localStorage.getItem(storageKey);
    var cookieValue = cookieTheme ? decodeURIComponent(cookieTheme.split("=").slice(1).join("=")) : null;
    var savedTheme = storedTheme || cookieValue;

    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      theme = savedTheme;
      document.cookie = storageKey + "=" + encodeURIComponent(savedTheme) + "; path=/; max-age=" + cookieMaxAge + "; samesite=lax";
    }
  } catch (error) {}

  var resolvedTheme = theme;

  if (theme === "system") {
    resolvedTheme = window.matchMedia && window.matchMedia(darkModeQuery).matches ? "dark" : "light";
  }

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.style.colorScheme = resolvedTheme;
})();
`.trim();
}
