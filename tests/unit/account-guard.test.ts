import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createDeleteAccountSchema } from "@/features/delete-account";
import { deleteCurrentAccount } from "@/features/delete-account/api/delete-account";
import {
  createHmacSha256,
  getAuthenticatedUsageCountIfAvailable,
  initializeAuthenticatedUsage,
  isMissingAccountStorageError,
  resolveFreeGenerationsUsedFromGuards,
} from "@/entities/usage";

describe("account guard", () => {
  it("creates deterministic HMAC hashes without exposing the raw value", () => {
    const secret = "a".repeat(32);
    const rawEmail = "jane@example.com";
    const firstHash = createHmacSha256(rawEmail, secret);
    const secondHash = createHmacSha256(rawEmail, secret);

    expect(firstHash).toBe(secondHash);
    expect(firstHash).not.toContain(rawEmail);
    expect(firstHash).toHaveLength(64);
  });

  it("requires the exact current email before account deletion", () => {
    const schema = createDeleteAccountSchema("jane@example.com", {
      emailRequired: "Email is required.",
      emailMismatch: "Email does not match.",
    });

    expect(schema.safeParse({ email: "jane@example.com" }).success).toBe(true);
    expect(schema.safeParse({ email: "JANE@example.com" }).success).toBe(false);
    expect(schema.safeParse({ email: "other@example.com" }).success).toBe(false);
  });

  it("restores usage from email guard matches and ignores IP-only matches", () => {
    expect(
      resolveFreeGenerationsUsedFromGuards({
        emailGuardUsed: 3,
        ipGuardUsed: null,
      }),
    ).toBe(3);
    expect(
      resolveFreeGenerationsUsedFromGuards({
        emailGuardUsed: null,
        ipGuardUsed: 3,
      }),
    ).toBe(0);
  });

  it("detects missing account storage errors", () => {
    expect(
      isMissingAccountStorageError({
        code: "42P01",
        message: 'relation "public.usage_limits" does not exist',
      }),
    ).toBe(true);
    expect(
      isMissingAccountStorageError({
        code: "23505",
        message: "duplicate key value violates unique constraint",
      }),
    ).toBe(false);
  });

  it("keeps the profile creation trigger idempotent", () => {
    const migration = readFileSync(
      join(
        process.cwd(),
        "supabase/migrations/20260517231011_make_profile_trigger_idempotent.sql",
      ),
      "utf8",
    );

    expect(migration).toContain("on conflict (id) do nothing");
  });

  it("returns unavailable usage instead of throwing when storage is missing", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({
              data: null,
              error: {
                code: "42P01",
                message: 'relation "public.usage_limits" does not exist',
              },
            }),
          }),
        }),
      }),
    };

    await expect(
      getAuthenticatedUsageCountIfAvailable("user-id", client as never),
    ).resolves.toBeNull();
    consoleError.mockRestore();
  });

  it("initializes authenticated usage through an idempotent user_id upsert", async () => {
    const originalSecret = process.env.ACCOUNT_GUARD_HMAC_SECRET;
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.ACCOUNT_GUARD_HMAC_SECRET = "a".repeat(32);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const upsert = vi.fn().mockResolvedValue({ error: null });
    const client = {
      from: vi.fn((table: string) => {
        if (table === "deleted_user_guards") {
          return {
            select: () => ({
              eq: () => ({
                gt: () => ({
                  order: () => ({
                    limit: () => ({
                      maybeSingle: async () => ({
                        data: { free_generations_used: 3 },
                        error: null,
                      }),
                    }),
                  }),
                }),
              }),
            }),
          };
        }

        return { upsert };
      }),
    };

    try {
      await initializeAuthenticatedUsage({
        userId: "00000000-0000-0000-0000-000000000001",
        email: "jane@example.com",
        ip: "127.0.0.1",
        client: client as never,
      });
      await initializeAuthenticatedUsage({
        userId: "00000000-0000-0000-0000-000000000001",
        email: "jane@example.com",
        ip: "127.0.0.1",
        client: client as never,
      });

      expect(upsert).toHaveBeenCalledTimes(2);
      expect(upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "00000000-0000-0000-0000-000000000001",
          free_generations_used: 3,
        }),
        {
          onConflict: "user_id",
          ignoreDuplicates: true,
        },
      );
    } finally {
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
    }
  });

  it("writes a hashed guard record before deleting the Supabase auth user", async () => {
    const originalSecret = process.env.ACCOUNT_GUARD_HMAC_SECRET;
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    process.env.ACCOUNT_GUARD_HMAC_SECRET = "a".repeat(32);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";

    const insertedGuards: Array<Record<string, unknown>> = [];
    const deleteUser = vi.fn().mockResolvedValue({ error: null });
    const client = {
      auth: {
        admin: {
          deleteUser,
        },
      },
      from: vi.fn((table: string) => {
        if (table === "usage_limits") {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { free_generations_used: 2 },
                  error: null,
                }),
              }),
            }),
          };
        }

        return {
          insert: (payload: Record<string, unknown>) => {
            insertedGuards.push(payload);

            return {
              select: () => ({
                single: async () => ({ data: { id: "guard-id" }, error: null }),
              }),
            };
          },
          delete: () => ({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }),
    };

    await deleteCurrentAccount({
      user: {
        id: "00000000-0000-0000-0000-000000000001",
        email: "jane@example.com",
      },
      ip: "127.0.0.1",
      client: client as never,
    });

    expect(insertedGuards).toHaveLength(1);
    expect(insertedGuards[0].email_hash).not.toBe("jane@example.com");
    expect(insertedGuards[0].ip_hash).not.toBe("127.0.0.1");
    expect(insertedGuards[0].free_generations_used).toBe(2);
    expect(deleteUser).toHaveBeenCalledWith(
      "00000000-0000-0000-0000-000000000001",
      false,
    );

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
});
