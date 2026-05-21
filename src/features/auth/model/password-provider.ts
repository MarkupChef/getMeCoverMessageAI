type AuthIdentity = {
  provider?: string | null;
};

type PasswordIdentityUser = {
  identities?: AuthIdentity[] | null;
  app_metadata?: {
    provider?: string | null;
    providers?: string[] | null;
  } | null;
};

function hasEmailProvider(providers: readonly string[] | null | undefined) {
  return providers?.includes("email") ?? false;
}

export function canChangePasswordForUser(user: PasswordIdentityUser) {
  if (user.identities?.some((identity) => identity.provider === "email")) {
    return true;
  }

  return (
    user.app_metadata?.provider === "email" ||
    hasEmailProvider(user.app_metadata?.providers)
  );
}
