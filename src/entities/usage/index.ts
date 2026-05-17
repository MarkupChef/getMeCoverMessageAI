export {
  initializeAnonymousUsage,
  initializeAuthenticatedUsage,
  initializeAuthenticatedUsageIfConfigured,
  getAuthenticatedUsageCount,
  getAuthenticatedUsageCountIfAvailable,
  resolveFreeGenerationsUsedFromGuards,
  clampFreeGenerationsUsed,
} from "./api/usage";
export {
  isMissingAccountStorageError,
  isRecoverableUsageInitializationError,
} from "./lib/errors";
export {
  createHmacSha256,
  hashEmailForGuard,
  hashIpForGuard,
  hashUserIdForGuard,
  normalizeEmailForGuard,
} from "./lib/hash";
export {
  ANONYMOUS_FREE_GENERATIONS_LIMIT,
  AUTHENTICATED_FREE_GENERATIONS_LIMIT,
  DELETED_USER_GUARD_RETENTION_DAYS,
  usageLimitSchema,
  type UsageLimit,
} from "./model/schema";
