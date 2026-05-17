import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  DELETED_USER_GUARD_RETENTION_DAYS,
  getAuthenticatedUsageCount,
  hashEmailForGuard,
  hashIpForGuard,
  hashUserIdForGuard,
} from "@/entities/usage";
import { createSupabaseAdminClient } from "@/shared/api/supabase/admin";
import type { Database } from "@/shared/types/database";

type AdminClient = SupabaseClient<Database>;

type DeleteCurrentAccountInput = {
  user: Pick<User, "id" | "email">;
  ip: string | null;
  client?: AdminClient;
};

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

export async function deleteCurrentAccount({
  user,
  ip,
  client = createSupabaseAdminClient(),
}: DeleteCurrentAccountInput) {
  if (!user.email) {
    throw new Error("Current user email is required to delete the account.");
  }

  const freeGenerationsUsed = await getAuthenticatedUsageCount(user.id, client);
  const { data: guard, error: guardError } = await client
    .from("deleted_user_guards")
    .insert({
      email_hash: hashEmailForGuard(user.email),
      user_id_hash: hashUserIdForGuard(user.id),
      ip_hash: hashIpForGuard(ip),
      device_hash: null,
      free_generations_used: freeGenerationsUsed,
      expires_at: addDays(
        new Date(),
        DELETED_USER_GUARD_RETENTION_DAYS,
      ).toISOString(),
      reason: "account_deleted",
    })
    .select("id")
    .single();

  if (guardError) {
    throw guardError;
  }

  const { error: deleteError } = await client.auth.admin.deleteUser(user.id, false);

  if (deleteError) {
    await client.from("deleted_user_guards").delete().eq("id", guard.id);
    throw deleteError;
  }
}

