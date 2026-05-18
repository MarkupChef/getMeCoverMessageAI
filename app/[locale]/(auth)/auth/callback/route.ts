import { NextResponse, type NextRequest } from "next/server";
import { initializeAuthenticatedUsageIfConfigured } from "@/entities/usage";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";
import { getClientIpFromHeaders } from "@/shared/lib/request";

type AuthCallbackRouteContext = {
  params: Promise<{
    locale?: string;
  }>;
};

export async function GET(request: NextRequest, context: AuthCallbackRouteContext) {
  const requestUrl = new URL(request.url);
  const { locale: requestedLocale } = await context.params;
  const locale = getSupportedLocale(requestedLocale);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? getLocalizedPath(locale, "/results");

  if (code && hasPublicEnv()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user?.email) {
      await initializeAuthenticatedUsageIfConfigured({
        userId: data.user.id,
        email: data.user.email,
        ip: getClientIpFromHeaders(request.headers),
      });
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
