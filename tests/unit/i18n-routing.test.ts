import { describe, expect, it } from "vitest";
import {
  getLocalizedPath,
  getSupportedLocale,
  localeLabels,
  routing,
} from "@/shared/i18n/routing";

describe("i18n routing", () => {
  it("does not prefix default locale paths", () => {
    expect(getLocalizedPath("en", "/results")).toBe("/results");
    expect(getLocalizedPath("en", "/")).toBe("/");
  });

  it("prefixes non-default locale paths", () => {
    expect(getLocalizedPath("uk", "/results")).toBe("/uk/results");
    expect(getLocalizedPath("uk", "/")).toBe("/uk");
  });

  it("keeps locale labels aligned with configured locales", () => {
    expect(Object.keys(localeLabels).sort()).toEqual([...routing.locales].sort());
  });

  it("falls back to the default locale for unsupported params", () => {
    expect(getSupportedLocale(undefined)).toBe("en");
    expect(getSupportedLocale("missing")).toBe("en");
    expect(getSupportedLocale("uk")).toBe("uk");
  });
});
