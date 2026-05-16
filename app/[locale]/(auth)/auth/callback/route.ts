import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";

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
  const next = requestUrl.searchParams.get("next") ?? getLocalizedPath(locale, "/dashboard");

  if (code && hasPublicEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
