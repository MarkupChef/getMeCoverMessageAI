import { createClient } from "@supabase/supabase-js";
import { getAccountDeletionEnv } from "@/shared/config/server-env";
import type { Database } from "@/shared/types/database";

export function createSupabaseAdminClient() {
  const env = getAccountDeletionEnv();

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
