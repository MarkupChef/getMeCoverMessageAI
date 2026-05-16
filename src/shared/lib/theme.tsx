"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark" | "system";

type ResolvedTheme = Exclude<Theme, "system">;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "theme";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";
const DEFAULT_THEME: Theme = "system";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);

    return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }

  return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSystemTheme();
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setThemeState(isTheme(event.newValue) ? event.newValue : DEFAULT_THEME);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function subscribeToSystemTheme(onStoreChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function useSystemTheme(): ResolvedTheme {
  return useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    (): ResolvedTheme => "light",
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
