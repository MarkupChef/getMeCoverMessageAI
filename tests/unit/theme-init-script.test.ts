import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getThemeInitScript } from "@/shared/lib/theme-init-script";

function runThemeInitScript() {
  window.eval(getThemeInitScript());
}

function mockSystemTheme(isDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: isDark,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("theme init script", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.style.colorScheme = "";
    window.localStorage.clear();
    document.cookie = "theme=; path=/; max-age=0";
    mockSystemTheme(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies dark theme from local storage before hydration", () => {
    window.localStorage.setItem("theme", "dark");

    runThemeInitScript();

    expect(document.documentElement).toHaveClass("dark");
    expect(document.cookie).toContain("theme=dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("keeps light theme from local storage before hydration", () => {
    window.localStorage.setItem("theme", "light");

    runThemeInitScript();

    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement).toHaveClass("light");
    expect(document.cookie).toContain("theme=light");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("resolves system theme before hydration", () => {
    window.localStorage.setItem("theme", "system");
    mockSystemTheme(true);

    runThemeInitScript();

    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light");
    expect(document.cookie).toContain("theme=system");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
});
