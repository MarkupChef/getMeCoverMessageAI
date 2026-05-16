import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uk"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: false,
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels = {
  en: "English",
  uk: "Українська",
} satisfies Record<Locale, string>;

export function getLocalizedPath(locale: Locale, pathname: `/${string}`) {
  if (locale === routing.defaultLocale) {
    return pathname;
  }

  if (pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathname}`;
}

export function getSupportedLocale(locale: string | undefined): Locale {
  if (routing.locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return routing.defaultLocale;
}
