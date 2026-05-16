import { redirect } from "next/navigation";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";

export const dynamic = "force-dynamic";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasPublicEnv()) {
    redirect("/sign-in");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout userEmail={user.email ?? "member@example.com"}>
      {children}
    </DashboardLayout>
  );
}
