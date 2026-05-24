import { createSupabaseAdminClient } from "@/shared/api/supabase/admin";
import { hasAccountDeletionEnv } from "@/shared/config/server-env";
import type { Database } from "@/shared/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ANONYMOUS_FREE_GENERATIONS_LIMIT,
  ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS,
  AUTHENTICATED_FREE_GENERATIONS_LIMIT,
  type AnonymousUsageResult,
  type AnonymousUsageSnapshot,
} from "../model/schema";
import {
  hashDeviceForGuard,
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
  deviceId?: string | null;
  ip: string | null;
  client?: AdminClient;
};

type HashedAnonymousIdentity = {
  anonymousIdHash: string;
  deviceHash: string | null;
  ipHash: string | null;
};

type PreparedAnonymousUsage =
  | {
      status: "ready";
      usageLimitId: string;
    }
  | {
      status: "signup_required";
    };

type UsageCounterRow = {
  id: string;
  free_generations_used: number;
  free_generations_limit: number;
};

type ConsumeUsageLimitRow = UsageCounterRow & {
  consumed: boolean;
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

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function getAnonymousIdentityExpiry(now = new Date()) {
  return addDays(now, ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS).toISOString();
}

function createAnonymousIdentityHashes({
  anonymousId,
  deviceId = null,
  ip,
}: Omit<AnonymousUsageInput, "client">): HashedAnonymousIdentity {
  return {
    anonymousIdHash: hashUserIdForGuard(anonymousId),
    deviceHash: hashDeviceForGuard(deviceId),
    ipHash: hashIpForGuard(ip),
  };
}

function getAnonymousUsageState(
  row: ConsumeUsageLimitRow,
): Exclude<AnonymousUsageResult, { status: "signup_required" | "unavailable" }> {
  const remaining = Math.max(
    0,
    row.free_generations_limit - row.free_generations_used,
  );

  return {
    status: row.consumed ? "consumed" : "exhausted",
    used: row.free_generations_used,
    limit: row.free_generations_limit,
    remaining,
  };
}

function getAnonymousUsageSnapshotState(
  row: UsageCounterRow,
): Exclude<AnonymousUsageSnapshot, { status: "signup_required" | "unavailable" }> {
  const remaining = Math.max(
    0,
    row.free_generations_limit - row.free_generations_used,
  );

  return {
    status: remaining > 0 ? "available" : "exhausted",
    used: row.free_generations_used,
    limit: row.free_generations_limit,
    remaining,
  };
}

function getDefaultAnonymousUsageSnapshot(): AnonymousUsageSnapshot {
  return {
    status: "available",
    used: 0,
    limit: ANONYMOUS_FREE_GENERATIONS_LIMIT,
    remaining: ANONYMOUS_FREE_GENERATIONS_LIMIT,
  };
}

async function findUsageById(client: AdminClient, id: string) {
  const { data, error } = await client
    .from("usage_limits")
    .select("id, free_generations_used, free_generations_limit")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findLegacyAnonymousUsage(
  client: AdminClient,
  anonymousIdHash: string,
) {
  const { data, error } = await client
    .from("usage_limits")
    .select("id, free_generations_used, free_generations_limit")
    .eq("anonymous_id_hash", anonymousIdHash)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findUsageIdByAnonymousIdentity(
  client: AdminClient,
  anonymousIdHash: string,
  nowIso: string,
) {
  const { data, error } = await client
    .from("anonymous_usage_identities")
    .select("usage_limit_id")
    .eq("anonymous_id_hash", anonymousIdHash)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.usage_limit_id ?? null;
}

async function findUsageIdsByDeviceHash(
  client: AdminClient,
  deviceHash: string | null,
  nowIso: string,
) {
  if (!deviceHash) {
    return [];
  }

  const { data, error } = await client
    .from("anonymous_usage_identities")
    .select("usage_limit_id")
    .eq("device_hash", deviceHash)
    .gt("expires_at", nowIso);

  if (error) {
    throw error;
  }

  return Array.from(new Set(data.map((row) => row.usage_limit_id)));
}

function isDuplicateIdentityError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : null;
  const message = "message" in error ? error.message : null;

  return (
    code === "23505" ||
    (typeof message === "string" &&
      message.toLowerCase().includes("duplicate key"))
  );
}

async function attachAnonymousIdentity(
  client: AdminClient,
  usageLimitId: string,
  identity: HashedAnonymousIdentity,
) {
  const { error } = await client.from("anonymous_usage_identities").insert({
    usage_limit_id: usageLimitId,
    anonymous_id_hash: identity.anonymousIdHash,
    device_hash: identity.deviceHash,
    ip_hash: identity.ipHash,
    expires_at: getAnonymousIdentityExpiry(),
  });

  if (error && !isDuplicateIdentityError(error)) {
    throw error;
  }
}

async function createAnonymousUsageLimit(
  client: AdminClient,
  identity: HashedAnonymousIdentity,
) {
  const { data, error } = await client
    .from("usage_limits")
    .insert({
      anonymous_id_hash: identity.anonymousIdHash,
      ip_hash: identity.ipHash,
      free_generations_used: 0,
      free_generations_limit: ANONYMOUS_FREE_GENERATIONS_LIMIT,
    })
    .select("id, free_generations_used, free_generations_limit")
    .single();

  if (error) {
    throw error;
  }

  await attachAnonymousIdentity(client, data.id, identity);

  return data.id;
}

async function prepareAnonymousUsage(
  client: AdminClient,
  identity: HashedAnonymousIdentity,
): Promise<PreparedAnonymousUsage> {
  const nowIso = new Date().toISOString();
  const identityUsageId = await findUsageIdByAnonymousIdentity(
    client,
    identity.anonymousIdHash,
    nowIso,
  );

  if (identityUsageId) {
    return { status: "ready", usageLimitId: identityUsageId };
  }

  const legacyUsage = await findLegacyAnonymousUsage(client, identity.anonymousIdHash);

  if (legacyUsage) {
    await attachAnonymousIdentity(client, legacyUsage.id, identity);
    return { status: "ready", usageLimitId: legacyUsage.id };
  }

  const deviceUsageIds = await findUsageIdsByDeviceHash(
    client,
    identity.deviceHash,
    nowIso,
  );

  if (deviceUsageIds.length > 1) {
    return { status: "signup_required" };
  }

  if (deviceUsageIds.length === 1) {
    await attachAnonymousIdentity(client, deviceUsageIds[0], identity);
    return { status: "ready", usageLimitId: deviceUsageIds[0] };
  }

  return {
    status: "ready",
    usageLimitId: await createAnonymousUsageLimit(client, identity),
  };
}

async function resolveAnonymousUsageSnapshot(
  client: AdminClient,
  identity: HashedAnonymousIdentity,
): Promise<AnonymousUsageSnapshot> {
  const nowIso = new Date().toISOString();
  const identityUsageId = await findUsageIdByAnonymousIdentity(
    client,
    identity.anonymousIdHash,
    nowIso,
  );

  if (identityUsageId) {
    const usage = await findUsageById(client, identityUsageId);

    return usage ? getAnonymousUsageSnapshotState(usage) : { status: "unavailable" };
  }

  const legacyUsage = await findLegacyAnonymousUsage(client, identity.anonymousIdHash);

  if (legacyUsage) {
    return getAnonymousUsageSnapshotState(legacyUsage);
  }

  const deviceUsageIds = await findUsageIdsByDeviceHash(
    client,
    identity.deviceHash,
    nowIso,
  );

  if (deviceUsageIds.length > 1) {
    return { status: "signup_required" };
  }

  if (deviceUsageIds.length === 1) {
    const usage = await findUsageById(client, deviceUsageIds[0]);

    return usage ? getAnonymousUsageSnapshotState(usage) : { status: "unavailable" };
  }

  return getDefaultAnonymousUsageSnapshot();
}

async function consumeUsageLimit(client: AdminClient, usageLimitId: string) {
  const { data, error } = await client
    .rpc("consume_usage_limit", {
      p_usage_limit_id: usageLimitId,
    })
    .single();

  if (error) {
    throw error;
  }

  return data;
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
  deviceId = null,
  ip,
  client = createSupabaseAdminClient(),
}: AnonymousUsageInput) {
  const { anonymousIdHash, ipHash } = createAnonymousIdentityHashes({
    anonymousId,
    deviceId,
    ip,
  });

  await upsertAnonymousUsage(client, {
    anonymousIdHash,
    ipHash,
  });
}

export async function consumeAnonymousFreeGeneration({
  anonymousId,
  deviceId = null,
  ip,
  client = createSupabaseAdminClient(),
}: AnonymousUsageInput): Promise<AnonymousUsageResult> {
  const identity = createAnonymousIdentityHashes({ anonymousId, deviceId, ip });
  const preparedUsage = await prepareAnonymousUsage(client, identity);

  if (preparedUsage.status === "signup_required") {
    return { status: "signup_required" };
  }

  const usage = await findUsageById(client, preparedUsage.usageLimitId);

  if (!usage) {
    return { status: "unavailable" };
  }

  const consumedUsage = await consumeUsageLimit(client, usage.id);

  return getAnonymousUsageState(consumedUsage);
}

export async function getAnonymousFreeGenerationSnapshot({
  anonymousId,
  deviceId = null,
  ip,
  client = createSupabaseAdminClient(),
}: AnonymousUsageInput): Promise<AnonymousUsageSnapshot> {
  const identity = createAnonymousIdentityHashes({ anonymousId, deviceId, ip });

  return resolveAnonymousUsageSnapshot(client, identity);
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
