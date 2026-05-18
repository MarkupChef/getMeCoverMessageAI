import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasPublicEnv } from "@/shared/config/env";
import type { ServerAuthState } from "../model/types";

export async function getServerAuthState(): Promise<ServerAuthState> {
  if (!hasPublicEnv()) {
    return { status: "guest" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "guest" };
  }

  return {
    status: "authenticated",
    user: {
      id: user.id,
      email: user.email ?? null,
    },
  };
}
