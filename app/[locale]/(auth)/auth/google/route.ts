import { NextResponse } from "next/server";
import { createGoogleOAuthRedirect } from "@/features/auth";

export async function POST(request: Request) {
  const result = await createGoogleOAuthRedirect();
  const requestUrl = new URL(request.url);
  const locale = requestUrl.pathname.split("/")[1] || "en";

  if (!result.ok || !result.url) {
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set("authError", result.message ?? "");

    return NextResponse.redirect(signInUrl, 303);
  }

  return NextResponse.redirect(result.url, 303);
}
