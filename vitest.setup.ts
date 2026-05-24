import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

const i18nRouter = {
  replace: vi.fn(),
  refresh: vi.fn(),
};

vi.stubGlobal("__i18nRouter", i18nRouter);

vi.mock("@/shared/i18n", () => ({
  Link: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  }) => React.createElement("a", { href, ...props }, children),
  getPathname: vi.fn(),
  getLocalizedPath: (locale: string, pathname: string) =>
    locale === "en" ? pathname : `/${locale}${pathname}`,
  getSupportedLocale: (locale?: string) =>
    locale === "en" || locale === "uk" ? locale : "en",
  localeLabels: {
    en: "English",
    uk: "Українська",
  },
  redirect: vi.fn(),
  routing: {
    locales: ["en", "uk"],
    defaultLocale: "en",
  },
  usePathname: () => "/dashboard",
  useRouter: () => i18nRouter,
}));

vi.mock("@fingerprintjs/fingerprintjs", () => ({
  load: vi.fn(async () => ({
    get: vi.fn(async () => ({ visitorId: "test-device" })),
  })),
}));

vi.mock("@/features/anonymous-usage/api/actions", () => ({
  getAnonymousUsageLimitAction: vi.fn(async () => ({
    status: "available",
    used: 0,
    limit: 2,
    remaining: 2,
  })),
  consumeAnonymousUsageLimitAction: vi.fn(async () => ({
    status: "consumed",
    used: 1,
    limit: 2,
    remaining: 1,
  })),
}));
