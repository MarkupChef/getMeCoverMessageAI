import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ANONYMOUS_FREE_GENERATIONS_LIMIT,
  consumeAnonymousFreeGeneration,
  getAnonymousFreeGenerationSnapshot,
  hashIpForGuard,
  initializeAnonymousUsage,
} from "@/entities/usage";

type UsageRow = {
  id: string;
  anonymous_id_hash: string | null;
  ip_hash: string | null;
  free_generations_used: number;
  free_generations_limit: number;
};

type IdentityRow = {
  usage_limit_id: string;
  anonymous_id_hash: string | null;
  device_hash: string | null;
  ip_hash: string | null;
  expires_at: string;
};

function createFakeUsageClient() {
  const usageRows: UsageRow[] = [];
  const identityRows: IdentityRow[] = [];

  function maybeSingle<T>(rows: T[]) {
    return Promise.resolve({
      data: rows.length === 0 ? null : rows[0],
      error: null,
    });
  }

  return {
    usageRows,
    identityRows,
    rpc(name: string, params: Record<string, unknown>) {
      if (name !== "consume_usage_limit") {
        throw new Error(`Unexpected rpc: ${name}`);
      }

      const row = usageRows.find(
        (item) => item.id === params.p_usage_limit_id,
      );

      if (!row) {
        return {
          single: async () => ({
            data: null,
            error: { message: "usage row not found" },
          }),
        };
      }

      const consumed = row.free_generations_used < row.free_generations_limit;

      if (consumed) {
        row.free_generations_used += 1;
      }

      return {
        single: async () => ({
          data: {
            id: row.id,
            free_generations_used: row.free_generations_used,
            free_generations_limit: row.free_generations_limit,
            consumed,
          },
          error: null,
        }),
      };
    },
    from(table: string) {
      if (table === "usage_limits") {
        return {
          insert(payload: Partial<UsageRow>) {
            const row = {
              id: `usage-${usageRows.length + 1}`,
              anonymous_id_hash: payload.anonymous_id_hash ?? null,
              ip_hash: payload.ip_hash ?? null,
              free_generations_used: payload.free_generations_used ?? 0,
              free_generations_limit:
                payload.free_generations_limit ??
                ANONYMOUS_FREE_GENERATIONS_LIMIT,
            };
            usageRows.push(row);

            return {
              select: () => ({
                single: async () => ({ data: row, error: null }),
              }),
            };
          },
          select: () => ({
            eq(column: keyof UsageRow, value: string) {
              const rows = usageRows.filter((row) => row[column] === value);

              return {
                maybeSingle: () => maybeSingle(rows),
              };
            },
          }),
          update(payload: Partial<UsageRow>) {
            return {
              eq(column: keyof UsageRow, value: string) {
                const row = usageRows.find((item) => item[column] === value);

                if (row) {
                  Object.assign(row, payload);
                }

                return Promise.resolve({ error: null });
              },
            };
          },
        };
      }

      if (table === "anonymous_usage_identities") {
        return {
          insert(payload: Partial<IdentityRow>) {
            identityRows.push({
              usage_limit_id: payload.usage_limit_id ?? "",
              anonymous_id_hash: payload.anonymous_id_hash ?? null,
              device_hash: payload.device_hash ?? null,
              ip_hash: payload.ip_hash ?? null,
              expires_at: payload.expires_at ?? new Date().toISOString(),
            });

            return Promise.resolve({ error: null });
          },
          select: () => ({
            eq(column: keyof IdentityRow, value: string) {
              const rows = identityRows.filter((row) => row[column] === value);

              return {
                gt(expiryColumn: "expires_at", now: string) {
                  const activeRows = rows.filter(
                    (row) => row[expiryColumn] > now,
                  );

                  return {
                    maybeSingle: () => maybeSingle(activeRows),
                    then: (
                      resolve: (value: {
                        data: IdentityRow[];
                        error: null;
                      }) => void,
                    ) => resolve({ data: activeRows, error: null }),
                  };
                },
              };
            },
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    },
  };
}

describe("anonymous usage limits", () => {
  const originalSecret = process.env.ACCOUNT_GUARD_HMAC_SECRET;
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  beforeEach(() => {
    process.env.ACCOUNT_GUARD_HMAC_SECRET = "a".repeat(32);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.ACCOUNT_GUARD_HMAC_SECRET;
    } else {
      process.env.ACCOUNT_GUARD_HMAC_SECRET = originalSecret;
    }

    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }

    if (originalServiceRole === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRole;
    }
  });

  it("returns a default snapshot for a new guest without creating usage rows", async () => {
    const client = createFakeUsageClient();

    await expect(
      getAnonymousFreeGenerationSnapshot({
        anonymousId: "new-cookie",
        deviceId: "new-device",
        ip: "127.0.0.1",
        client: client as never,
      }),
    ).resolves.toEqual({
      status: "available",
      used: 0,
      limit: ANONYMOUS_FREE_GENERATIONS_LIMIT,
      remaining: ANONYMOUS_FREE_GENERATIONS_LIMIT,
    });
    expect(client.usageRows).toHaveLength(0);
    expect(client.identityRows).toHaveLength(0);
  });

  it("uses two anonymous generations and returns exhausted on the third request", async () => {
    const client = createFakeUsageClient();

    await expect(
      consumeAnonymousFreeGeneration({
        anonymousId: "anon-cookie",
        deviceId: "device",
        ip: "127.0.0.1",
        client: client as never,
      }),
    ).resolves.toMatchObject({ status: "consumed", used: 1, remaining: 1 });

    await expect(
      consumeAnonymousFreeGeneration({
        anonymousId: "anon-cookie",
        deviceId: "device",
        ip: "127.0.0.1",
        client: client as never,
      }),
    ).resolves.toMatchObject({ status: "consumed", used: 2, remaining: 0 });

    await expect(
      consumeAnonymousFreeGeneration({
        anonymousId: "anon-cookie",
        deviceId: "device",
        ip: "127.0.0.1",
        client: client as never,
      }),
    ).resolves.toMatchObject({ status: "exhausted", used: 2, remaining: 0 });
  });

  it("resolves legacy anonymous usage and backfills an identity row", async () => {
    const client = createFakeUsageClient();

    await initializeAnonymousUsage({
      anonymousId: "legacy-cookie",
      deviceId: null,
      ip: "127.0.0.1",
      client: client as never,
    });

    const result = await consumeAnonymousFreeGeneration({
      anonymousId: "legacy-cookie",
      deviceId: "new-device",
      ip: "127.0.0.1",
      client: client as never,
    });

    expect(result.status).toBe("consumed");
    expect(client.usageRows).toHaveLength(1);
    expect(client.identityRows).toHaveLength(1);
    expect(client.identityRows[0].usage_limit_id).toBe(client.usageRows[0].id);
  });

  it("reads a same-cookie anonymous snapshot without consuming usage", async () => {
    const client = createFakeUsageClient();

    await consumeAnonymousFreeGeneration({
      anonymousId: "same-cookie",
      deviceId: "same-device",
      ip: "127.0.0.1",
      client: client as never,
    });

    await expect(
      getAnonymousFreeGenerationSnapshot({
        anonymousId: "same-cookie",
        deviceId: "same-device",
        ip: "127.0.0.1",
        client: client as never,
      }),
    ).resolves.toMatchObject({ status: "available", used: 1, remaining: 1 });
    expect(client.usageRows[0].free_generations_used).toBe(1);
  });

  it("attaches a new anonymous cookie when one usage row matches device hash", async () => {
    const client = createFakeUsageClient();

    await consumeAnonymousFreeGeneration({
      anonymousId: "first-cookie",
      deviceId: "shared-device",
      ip: "127.0.0.1",
      client: client as never,
    });

    const result = await consumeAnonymousFreeGeneration({
      anonymousId: "second-cookie",
      deviceId: "shared-device",
      ip: "127.0.0.2",
      client: client as never,
    });

    expect(result).toMatchObject({ status: "consumed", used: 2 });
    expect(client.usageRows).toHaveLength(1);
    expect(client.identityRows).toHaveLength(2);
  });

  it("reads an existing device snapshot for a new browser", async () => {
    const client = createFakeUsageClient();

    await consumeAnonymousFreeGeneration({
      anonymousId: "first-cookie",
      deviceId: "shared-device",
      ip: "127.0.0.1",
      client: client as never,
    });

    await expect(
      getAnonymousFreeGenerationSnapshot({
        anonymousId: "second-cookie",
        deviceId: "shared-device",
        ip: "127.0.0.2",
        client: client as never,
      }),
    ).resolves.toMatchObject({ status: "available", used: 1, remaining: 1 });
    expect(client.usageRows).toHaveLength(1);
    expect(client.identityRows).toHaveLength(1);
  });

  it("returns signup_required and does not merge when device hash is ambiguous", async () => {
    const client = createFakeUsageClient();

    await consumeAnonymousFreeGeneration({
      anonymousId: "first-cookie",
      deviceId: "ambiguous-device",
      ip: "127.0.0.1",
      client: client as never,
    });
    await consumeAnonymousFreeGeneration({
      anonymousId: "second-cookie",
      deviceId: "other-device",
      ip: "127.0.0.2",
      client: client as never,
    });
    client.identityRows[1].device_hash = client.identityRows[0].device_hash;

    const result = await consumeAnonymousFreeGeneration({
      anonymousId: "third-cookie",
      deviceId: "ambiguous-device",
      ip: "127.0.0.3",
      client: client as never,
    });

    expect(result).toEqual({ status: "signup_required" });
    expect(client.usageRows).toHaveLength(2);
    expect(client.identityRows).toHaveLength(2);
  });

  it("returns signup_required snapshots for ambiguous device hashes", async () => {
    const client = createFakeUsageClient();

    await consumeAnonymousFreeGeneration({
      anonymousId: "first-cookie",
      deviceId: "ambiguous-device",
      ip: "127.0.0.1",
      client: client as never,
    });
    await consumeAnonymousFreeGeneration({
      anonymousId: "second-cookie",
      deviceId: "other-device",
      ip: "127.0.0.2",
      client: client as never,
    });
    client.identityRows[1].device_hash = client.identityRows[0].device_hash;

    await expect(
      getAnonymousFreeGenerationSnapshot({
        anonymousId: "third-cookie",
        deviceId: "ambiguous-device",
        ip: "127.0.0.3",
        client: client as never,
      }),
    ).resolves.toEqual({ status: "signup_required" });
    expect(client.usageRows).toHaveLength(2);
    expect(client.identityRows).toHaveLength(2);
  });

  it("returns exhausted snapshots without consuming another usage", async () => {
    const client = createFakeUsageClient();

    await consumeAnonymousFreeGeneration({
      anonymousId: "anon-cookie",
      deviceId: "device",
      ip: "127.0.0.1",
      client: client as never,
    });
    await consumeAnonymousFreeGeneration({
      anonymousId: "anon-cookie",
      deviceId: "device",
      ip: "127.0.0.1",
      client: client as never,
    });

    await expect(
      getAnonymousFreeGenerationSnapshot({
        anonymousId: "anon-cookie",
        deviceId: "device",
        ip: "127.0.0.1",
        client: client as never,
      }),
    ).resolves.toMatchObject({ status: "exhausted", used: 2, remaining: 0 });
    expect(client.usageRows[0].free_generations_used).toBe(2);
  });

  it("does not merge anonymous users by IP alone", async () => {
    const client = createFakeUsageClient();
    const ip = "127.0.0.1";

    await consumeAnonymousFreeGeneration({
      anonymousId: "first-cookie",
      deviceId: null,
      ip,
      client: client as never,
    });
    await consumeAnonymousFreeGeneration({
      anonymousId: "second-cookie",
      deviceId: null,
      ip,
      client: client as never,
    });

    expect(client.usageRows).toHaveLength(2);
    expect(client.identityRows).toHaveLength(2);
    expect(client.identityRows[0].ip_hash).toBe(hashIpForGuard(ip));
    expect(client.identityRows[1].ip_hash).toBe(hashIpForGuard(ip));
  });
});
