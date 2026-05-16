import { NextResponse } from "next/server";
import { createGoogleOAuthRedirect } from "@/features/auth";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";

type GoogleAuthRouteContext = {
  params: Promise<{
    locale?: string;
  }>;
};

export async function POST(request: Request, context: GoogleAuthRouteContext) {
  const result = await createGoogleOAuthRedirect();
  const { locale: requestedLocale } = await context.params;
  const locale = getSupportedLocale(requestedLocale);

  if (!result.ok || !result.url) {
    const signInUrl = new URL(getLocalizedPath(locale, "/sign-in"), request.url);
    signInUrl.searchParams.set("authError", result.message ?? "");

    return NextResponse.redirect(signInUrl, 303);
  }

  return NextResponse.redirect(result.url, 303);
}
