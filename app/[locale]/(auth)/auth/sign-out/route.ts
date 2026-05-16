import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const locale = requestUrl.pathname.split("/")[1] || "en";

  if (hasPublicEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url), 303);
}
