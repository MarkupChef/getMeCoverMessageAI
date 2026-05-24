# Feature: Auth-Aware UI

## Purpose

Auth-aware UI keeps public routes consistent with the signed-in state without relying on client-only checks. It prevents authenticated users from seeing sign-in/sign-up entry points and redirects them away from public auth pages while keeping private route and API protection server-side.

## Core Decisions

- Decision: Resolve public auth state on the server.
  Reason: The home page and auth pages can render the correct state on first paint, avoiding client auth flicker.
- Decision: Expose only minimal session user data.
  Reason: Public UI only needs the status and safe identifiers; sensitive profile or metadata stays out of client props.
- Decision: Keep permissions separate from authentication.
  Reason: The scaffold has no role/team model yet, so RBAC should not be invented before product requirements exist.

## Key Files

- `src/entities/session` - owns the minimal server auth state type and Supabase-backed resolver.
- `app/[locale]/page.tsx` - resolves auth before rendering the public home view.
- `app/[locale]/(auth)/sign-in/page.tsx` - redirects authenticated users to the localized dashboard.
- `app/[locale]/(auth)/sign-up/page.tsx` - redirects authenticated users to the localized dashboard.
- `src/views/home/ui/HomeView.tsx` - renders guest or authenticated navigation and CTA variants.
- `src/widgets/site-header/ui/SiteHeader.tsx` - renders the guest sign-in action and the anonymous free-credit counter.
- `src/features/anonymous-usage/ui/AnonymousUsageCounter.tsx` - renders the guest-only remaining credits in human-readable text.
- `src/widgets/user-menu/ui/UserMenu.tsx` - renders authenticated profile actions and posts sign-out to the localized route.

## Runtime Flow

1. Public home requests call `getServerAuthState()`.
2. If Supabase public env is missing or `auth.getUser()` returns no user, the state is `guest`.
3. If a user exists, the state is `authenticated` with only `id` and `email`.
4. `HomeView` uses that server-provided state to render guest auth links or authenticated dashboard/profile controls.
5. Guest headers show the anonymous free-credit counter next to sign-in; authenticated headers omit it.
6. `/sign-in` and `/sign-up` resolve the same server auth state and redirect authenticated users to the localized `/dashboard`.

## Data / State Model

- Valid shared auth state statuses are `guest`, `authenticated`, and `loading`.
- `getServerAuthState()` returns only server-resolved `guest` or `authenticated`.
- `loading` is reserved for client transition states such as form submit and sign-out pending UI.
- Authenticated user props are intentionally limited to `id` and nullable `email`.

## Invariants

- Do not add a global client AuthProvider just to render initial public navigation.
- Keep private route and API authorization checks server-side; hidden buttons are not security.
- Do not read authorization decisions from user-editable metadata.
- Do not introduce roles or permissions until the product has a concrete permission model.

## Edge Cases

- Missing Supabase public env falls back to `guest` instead of throwing on public routes.
- Expired or invalid sessions resolve through Supabase `getUser()` and render as `guest`.
- Locale-aware redirects preserve `/uk/dashboard` for Ukrainian auth routes.
- The public home header uses an explicit localized sign-out route so `UserMenu` works outside nested dashboard paths.
- The free-credit counter is guest-only because signed-in usage is account-scoped.

## Related Features / Impact

- Theme switching is now available from the public home header.
- Anonymous usage limiting adds a guest-only `2 credits` style counter next to the sign-in action after its loading skeleton resolves.
- Dashboard/profile route protection remains in the protected route group.
- Account deletion API remains independently protected with `getUser()`.
- Sign-in/sign-up tests now cover authenticated redirects through mocked server auth state.

## Change Checklist

- Check both guest and authenticated home navigation when changing public CTAs.
- Check that the guest free-credit counter is absent for authenticated users.
- Keep `/sign-in` and `/sign-up` redirects localized.
- Add Route Handler or Server Action authorization checks near new sensitive operations.
- Revisit permissions only when a real role, team, billing, or entitlement requirement exists.

## Verification

- `corepack pnpm typecheck`
- `corepack pnpm lint`
- `corepack pnpm test:run`
- `corepack pnpm test:e2e`
- Relevant tests: `tests/unit/home-view.test.tsx`, `tests/unit/server-auth-state.test.ts`, `tests/unit/auth-page-redirects.test.ts`, `tests/e2e/app.spec.ts`.

## Last Updated Context

- Date: 2026-05-24
- Reason: Documented the guest anonymous free-credit counter near sign-in.
- Change type: Updated
- Affected areas: public home UI, site header, anonymous usage UI, auth-aware tests.
