import { z } from "zod";

export const ANONYMOUS_FREE_GENERATIONS_LIMIT = 2;
export const AUTHENTICATED_FREE_GENERATIONS_LIMIT = 5;
export const DELETED_USER_GUARD_RETENTION_DAYS = 180;
export const ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS = 30;

export const usageLimitSchema = z.object({
  id: z.uuid(),
  userId: z.uuid().nullable(),
  anonymousIdHash: z.string().nullable(),
  emailHash: z.string().nullable(),
  ipHash: z.string().nullable(),
  freeGenerationsUsed: z.number().int().min(0),
  freeGenerationsLimit: z.number().int().positive(),
});

export type UsageLimit = z.infer<typeof usageLimitSchema>;

export const anonymousUsageStateSchema = z.object({
  status: z.enum(["consumed", "exhausted"]),
  used: z.number().int().min(0),
  limit: z.number().int().positive(),
  remaining: z.number().int().min(0),
});

export const anonymousUsageSignupRequiredSchema = z.object({
  status: z.literal("signup_required"),
});

export const anonymousUsageUnavailableSchema = z.object({
  status: z.literal("unavailable"),
});

export const anonymousUsageResultSchema = z.discriminatedUnion("status", [
  anonymousUsageStateSchema,
  anonymousUsageSignupRequiredSchema,
  anonymousUsageUnavailableSchema,
]);

export type AnonymousUsageResult = z.infer<typeof anonymousUsageResultSchema>;
