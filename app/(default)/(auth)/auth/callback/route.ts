import { NextResponse, type NextRequest } from "next/server";
import { initializeAuthenticatedUsageIfConfigured } from "@/entities/usage";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { getClientIpFromHeaders } from "@/shared/lib/request";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

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
