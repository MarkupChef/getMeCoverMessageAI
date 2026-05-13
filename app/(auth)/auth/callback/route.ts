import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code && hasPublicEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
