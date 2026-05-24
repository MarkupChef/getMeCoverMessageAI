import { createHmac } from "node:crypto";
import { getAccountDeletionEnv } from "@/shared/config/server-env";

export function normalizeEmailForGuard(email: string) {
  return email.trim().toLowerCase();
}

export function createHmacSha256(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function hashEmailForGuard(email: string) {
  return createHmacSha256(
    normalizeEmailForGuard(email),
    getAccountDeletionEnv().ACCOUNT_GUARD_HMAC_SECRET,
  );
}

export function hashUserIdForGuard(userId: string) {
  return createHmacSha256(
    userId,
    getAccountDeletionEnv().ACCOUNT_GUARD_HMAC_SECRET,
  );
}

export function hashDeviceForGuard(deviceId: string | null) {
  if (!deviceId) {
    return null;
  }

  return createHmacSha256(
    deviceId.trim(),
    getAccountDeletionEnv().ACCOUNT_GUARD_HMAC_SECRET,
  );
}

export function hashIpForGuard(ip: string | null) {
  if (!ip) {
    return null;
  }

  return createHmacSha256(
    ip.trim(),
    getAccountDeletionEnv().ACCOUNT_GUARD_HMAC_SECRET,
  );
}
