export {
  initializeAnonymousUsage,
  initializeAuthenticatedUsage,
  initializeAuthenticatedUsageIfConfigured,
  consumeAnonymousFreeGeneration,
  getAnonymousFreeGenerationSnapshot,
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
  hashDeviceForGuard,
  hashIpForGuard,
  hashUserIdForGuard,
  normalizeEmailForGuard,
} from "./lib/hash";
export {
  ANONYMOUS_FREE_GENERATIONS_LIMIT,
  ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS,
  AUTHENTICATED_FREE_GENERATIONS_LIMIT,
  DELETED_USER_GUARD_RETENTION_DAYS,
  usageLimitSchema,
  type UsageLimit,
  type AnonymousUsageResult,
  type AnonymousUsageSnapshot,
} from "./model/schema";
