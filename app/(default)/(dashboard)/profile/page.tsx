import { redirect } from "next/navigation";
import {
  AUTHENTICATED_FREE_GENERATIONS_LIMIT,
  getAuthenticatedUsageCountIfAvailable,
} from "@/entities/usage";
import { ProfileView } from "@/views/profile";
import { createSupabaseAdminClient } from "@/shared/api/supabase/admin";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import { hasAccountDeletionEnv } from "@/shared/config/server-env";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!hasPublicEnv()) {
    redirect("/sign-in");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const freeGenerationsUsed = hasAccountDeletionEnv()
    ? await getAuthenticatedUsageCountIfAvailable(
        user.id,
        createSupabaseAdminClient(),
      )
    : null;

  return (
    <ProfileView
      email={user.email}
      fullName={profile?.full_name ?? null}
      freeGenerationsUsed={freeGenerationsUsed}
      freeGenerationsLimit={
        freeGenerationsUsed === null ? null : AUTHENTICATED_FREE_GENERATIONS_LIMIT
      }
    />
  );
}
