import { createSupabaseAdminClient } from "@/shared/api/supabase/admin";
import { hasAccountDeletionEnv } from "@/shared/config/server-env";
import type { Database } from "@/shared/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ANONYMOUS_FREE_GENERATIONS_LIMIT,
  AUTHENTICATED_FREE_GENERATIONS_LIMIT,
} from "../model/schema";
import {
  hashEmailForGuard,
  hashIpForGuard,
  hashUserIdForGuard,
} from "../lib/hash";
import {
  isMissingAccountStorageError,
  isRecoverableUsageInitializationError,
} from "../lib/errors";

type AdminClient = SupabaseClient<Database>;

type GuardMatchInput = {
  emailGuardUsed: number | null;
  ipGuardUsed: number | null;
};

type AuthenticatedUsageInput = {
  userId: string;
  email: string;
  ip: string | null;
  client?: AdminClient;
};

type AnonymousUsageInput = {
  anonymousId: string;
  ip: string | null;
  client?: AdminClient;
};

async function upsertAuthenticatedUsage(
  client: AdminClient,
  input: {
    userId: string;
    emailHash: string;
    ipHash: string | null;
    freeGenerationsUsed: number;
  },
) {
  const { error } = await client.from("usage_limits").upsert(
    {
      user_id: input.userId,
      email_hash: input.emailHash,
      ip_hash: input.ipHash,
      free_generations_used: input.freeGenerationsUsed,
      free_generations_limit: AUTHENTICATED_FREE_GENERATIONS_LIMIT,
    },
    {
      onConflict: "user_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    throw error;
  }
}

async function upsertAnonymousUsage(
  client: AdminClient,
  input: {
    anonymousIdHash: string;
    ipHash: string | null;
  },
) {
  const { data: existing, error: selectError } = await client
    .from("usage_limits")
    .select("id")
    .eq("anonymous_id_hash", input.anonymousIdHash)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    const { error } = await client
      .from("usage_limits")
      .update({
        ip_hash: input.ipHash,
        free_generations_limit: ANONYMOUS_FREE_GENERATIONS_LIMIT,
      })
      .eq("id", existing.id);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await client.from("usage_limits").insert({
    anonymous_id_hash: input.anonymousIdHash,
    ip_hash: input.ipHash,
    free_generations_used: 0,
    free_generations_limit: ANONYMOUS_FREE_GENERATIONS_LIMIT,
  });

  if (error) {
    throw error;
  }
}

export function resolveFreeGenerationsUsedFromGuards({
  emailGuardUsed,
}: GuardMatchInput) {
  return emailGuardUsed ?? 0;
}

export function clampFreeGenerationsUsed(used: number, limit: number) {
  return Math.max(0, Math.min(used, limit));
}

async function findActiveGuardUsageByEmailHash(
  client: AdminClient,
  emailHash: string,
) {
  const { data, error } = await client
    .from("deleted_user_guards")
    .select("free_generations_used")
    .eq("email_hash", emailHash)
    .gt("expires_at", new Date().toISOString())
    .order("deleted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.free_generations_used ?? null;
}

export async function initializeAuthenticatedUsage({
  userId,
  email,
  ip,
  client = createSupabaseAdminClient(),
}: AuthenticatedUsageInput) {
  const emailHash = hashEmailForGuard(email);
  const ipHash = hashIpForGuard(ip);
  const emailGuardUsed = await findActiveGuardUsageByEmailHash(client, emailHash);
  const freeGenerationsUsed = clampFreeGenerationsUsed(
    resolveFreeGenerationsUsedFromGuards({
      emailGuardUsed,
      ipGuardUsed: null,
    }),
    AUTHENTICATED_FREE_GENERATIONS_LIMIT,
  );

  await upsertAuthenticatedUsage(client, {
    userId,
    emailHash,
    ipHash,
    freeGenerationsUsed,
  });
}

export async function initializeAuthenticatedUsageIfConfigured(
  input: Omit<AuthenticatedUsageInput, "client">,
) {
  if (!hasAccountDeletionEnv()) {
    return;
  }

  try {
    await initializeAuthenticatedUsage(input);
  } catch (error) {
    if (isRecoverableUsageInitializationError(error)) {
      console.error("Account usage storage is not ready.", error);
      return;
    }

    throw error;
  }
}

export async function initializeAnonymousUsage({
  anonymousId,
  ip,
  client = createSupabaseAdminClient(),
}: AnonymousUsageInput) {
  const anonymousIdHash = hashUserIdForGuard(anonymousId);
  const ipHash = hashIpForGuard(ip);

  await upsertAnonymousUsage(client, {
    anonymousIdHash,
    ipHash,
  });
}

export async function getAuthenticatedUsageCount(
  userId: string,
  client: AdminClient = createSupabaseAdminClient(),
) {
  const { data, error } = await client
    .from("usage_limits")
    .select("free_generations_used")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.free_generations_used ?? 0;
}

export async function getAuthenticatedUsageCountIfAvailable(
  userId: string,
  client: AdminClient = createSupabaseAdminClient(),
) {
  try {
    return await getAuthenticatedUsageCount(userId, client);
  } catch (error) {
    if (isMissingAccountStorageError(error)) {
      console.error("Account usage storage migration is not applied.", error);
      return null;
    }

    throw error;
  }
}
