import { redirect } from "next/navigation";
import { ProtectedSiteLayout } from "@/app/layouts/ProtectedSiteLayout";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { getLocalizedPath, getSupportedLocale } from "@/shared/i18n";

export const dynamic = "force-dynamic";

export default async function ProtectedAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}) {
  const { locale: requestedLocale } = await params;
  const locale = getSupportedLocale(requestedLocale);
  const signInPath = getLocalizedPath(locale, "/sign-in");

  if (!hasPublicEnv()) {
    redirect(signInPath);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(signInPath);
  }

  return (
    <ProtectedSiteLayout userEmail={user.email ?? "member@example.com"}>
      {children}
    </ProtectedSiteLayout>
  );
}
