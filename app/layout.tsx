import { cookies, headers } from "next/headers";
import Script from "next/script";
import { routing } from "@/shared/i18n";
import { isTheme, THEME_STORAGE_KEY } from "@/shared/lib/theme-config";
import {
  getThemeInitScript,
  THEME_INIT_SCRIPT_ID,
} from "@/shared/lib/theme-init-script";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const requestCookies = await cookies();
  const locale =
    requestHeaders.get("x-next-intl-locale") ?? routing.defaultLocale;
  const themeCookie = requestCookies.get(THEME_STORAGE_KEY)?.value ?? null;
  const initialTheme = isTheme(themeCookie) ? themeCookie : null;
  const initialResolvedTheme = initialTheme === "dark" ? "dark" : "light";
  const themeClassName =
    initialTheme === "dark" || initialTheme === "light" ? ` ${initialTheme}` : "";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`h-full antialiased${themeClassName}`}
      style={
        initialTheme === "dark" || initialTheme === "light"
          ? { colorScheme: initialResolvedTheme }
          : undefined
      }
    >
      <body className="min-h-full bg-background text-foreground">
        <Script
          id={THEME_INIT_SCRIPT_ID}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: getThemeInitScript() }}
        />
        {children}
      </body>
    </html>
  );
}
