type SupabaseLikeError = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
};

function getErrorText(error: unknown) {
  if (!error || typeof error !== "object") {
    return "";
  }

  const supabaseError = error as SupabaseLikeError;

  return [
    supabaseError.code,
    supabaseError.message,
    supabaseError.details,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
}

export function isMissingAccountStorageError(error: unknown) {
  const errorText = getErrorText(error);

  return (
    errorText.includes("42p01") ||
    errorText.includes("pgrst205") ||
    errorText.includes("usage_limits") ||
    errorText.includes("deleted_user_guards")
  );
}

export function isRecoverableUsageInitializationError(error: unknown) {
  const errorText = getErrorText(error);

  return (
    isMissingAccountStorageError(error) ||
    errorText.includes("42p10") ||
    errorText.includes("unique or exclusion constraint")
  );
}
