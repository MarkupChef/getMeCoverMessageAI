import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/shared/api/supabase/middleware";
import { routing } from "@/shared/i18n";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return updateSession(request, NextResponse.next());
  }

  const defaultLocalePrefix = `/${routing.defaultLocale}`;
  const hasDefaultLocalePrefix =
    pathname === defaultLocalePrefix ||
    pathname.startsWith(`${defaultLocalePrefix}/`);
  const internalLocale = request.headers.get("x-next-intl-locale");

  if (hasDefaultLocalePrefix) {
    if (internalLocale === routing.defaultLocale) {
      return updateSession(request, NextResponse.next());
    }

    const url = request.nextUrl.clone();
    const nextPathname = pathname.slice(defaultLocalePrefix.length) || "/";
    url.pathname = nextPathname;

    return NextResponse.redirect(url);
  }

  const prefixedLocale = routing.locales.find(
    (locale) =>
      locale !== routing.defaultLocale &&
      (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)),
  );
  const locale = prefixedLocale ?? routing.defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", locale);

  if (locale === routing.defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });

    return updateSession(request, response);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
