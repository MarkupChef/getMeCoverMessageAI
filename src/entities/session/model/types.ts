export type AuthenticatedSessionUser = {
  id: string;
  email: string | null;
};

export type GuestAuthState = {
  status: "guest";
};

export type AuthenticatedAuthState = {
  status: "authenticated";
  user: AuthenticatedSessionUser;
};

export type LoadingAuthState = {
  status: "loading";
};

export type AuthState =
  | GuestAuthState
  | AuthenticatedAuthState
  | LoadingAuthState;

export type ServerAuthState = GuestAuthState | AuthenticatedAuthState;
