import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";

type SignOutRouteContext = {
  params: Promise<{
    locale?: string;
  }>;
};

export async function POST(request: Request, context: SignOutRouteContext) {
  const { locale: requestedLocale } = await context.params;
  const locale = getSupportedLocale(requestedLocale);

  if (hasPublicEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(
    new URL(getLocalizedPath(locale, "/sign-in"), request.url),
    303,
  );
}
