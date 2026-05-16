import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "@/shared/api/supabase/middleware";
import { routing } from "@/shared/i18n";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!pathnameHasLocale) {
    return updateSession(request);
  }

  const response = handleI18nRouting(request);

  return updateSession(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
