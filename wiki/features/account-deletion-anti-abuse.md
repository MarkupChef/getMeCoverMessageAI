# Feature: Account Deletion With Anti-Abuse Guard

## Purpose

This feature lets a signed-in user delete their account from the protected profile page while preserving a minimal anti-abuse trail. Personal account data is removed through Supabase Auth deletion and cascading database constraints, while HMAC-hashed technical signals are retained temporarily to prevent deleting and re-registering for fresh free-generation limits.

It also introduces the first usage-limit infrastructure for anonymous and authenticated users. Authenticated users get a limit of `5`; anonymous users get a limit of `3`.

## Core Decisions

- Decision: Deletion is exposed through `DELETE /api/account`.
  Reason: The route keeps destructive auth/admin work server-side and avoids exposing service-role credentials to client code.

- Decision: Confirmation requires typing the exact current email.
  Reason: It works for password and OAuth accounts without requiring password re-authentication.

- Decision: Anti-abuse signals are stored as HMAC SHA-256 hashes.
  Reason: The app needs repeat-registration detection without storing raw email, user id, or IP values in guard rows.

- Decision: `device_hash` is nullable and unused in v1.
  Reason: Browser fingerprinting was intentionally skipped to avoid privacy risk and extra dependencies.

- Decision: IP-only matches are audit-only.
  Reason: Shared networks create false positives; only `email_hash` restores previous free usage.

- Decision: Usage initialization is recoverable.
  Reason: Auth registration can succeed before usage storage is ready; the form should not crash after Supabase already created the user.

- Decision: Existing profile creation is idempotent.
  Reason: Deletion and re-registration can produce retry paths where duplicate profile inserts must not break auth completion.

## Key Files

- `app/api/account/route.ts` - verifies session, validates email confirmation, calls deletion service, clears session, and returns typed errors.
- `src/features/delete-account/ui/DeleteAccountDialog.tsx` - client dialog with exact-email validation, pending state, and redirect after deletion.
- `src/features/delete-account/api/delete-account.ts` - creates the guard row, reads usage count, and deletes the Supabase Auth user with admin credentials.
- `src/entities/usage/api/usage.ts` - initializes usage rows and restores usage from active email guard matches.
- `src/entities/usage/lib/hash.ts` - HMAC hashing helpers for email, user id, and IP.
- `src/entities/usage/lib/errors.ts` - detects missing/misaligned Supabase storage errors so UI routes can degrade gracefully.
- `src/views/profile/ui/ProfileView.tsx` - protected profile page composition, account details, usage summary, and danger zone.
- `src/shared/api/supabase/admin.ts` - server-only Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`.
- `src/shared/config/server-env.ts` - validates `SUPABASE_SERVICE_ROLE_KEY` and `ACCOUNT_GUARD_HMAC_SECRET`.
- `supabase/migrations/20260517120000_account_deletion_anti_abuse.sql` - creates guard and usage tables, RLS, grants, and update trigger dependency.
- `supabase/migrations/20260517123000_backfill_usage_limits_for_profiles.sql` - creates usage rows for existing profiles.
- `supabase/migrations/20260517124500_fix_usage_limits_unique_constraints.sql` - repairs `usage_limits` uniqueness when the earlier partial-index version was applied.
- `supabase/migrations/20260517231011_make_profile_trigger_idempotent.sql` - makes profile creation safe for retry/re-registration cases.

## Runtime Flow

1. A protected profile route fetches the current Supabase user and profile data.
2. If account-deletion env is configured, the page attempts to read `usage_limits`; missing storage is logged and rendered as unavailable instead of crashing.
3. The user opens the delete dialog and submits the exact signed-in email.
4. `DELETE /api/account` verifies public env, private deletion env, and the current Supabase user.
5. The route validates the JSON body with the same email-confirmation schema used by the UI.
6. `deleteCurrentAccount` reads current `free_generations_used`.
7. A `deleted_user_guards` row is inserted with HMAC-hashed email, user id, optional IP hash, current usage count, and `expires_at = now + 180 days`.
8. The Supabase admin client deletes the Auth user. Existing `profiles`, billing rows, and `usage_limits` user rows rely on cascade behavior.
9. If Auth deletion fails after guard insertion, the service tries to remove the new guard row before surfacing the error.
10. On success, the route signs out the current session and the UI redirects to `/sign-in`.

Registration and OAuth flows also call usage initialization after Supabase Auth succeeds. This step is best-effort for recoverable storage errors, so users do not see a runtime crash after Supabase has already sent a confirmation email.

## Data / State Model

- `deleted_user_guards`
  - Stores hashed anti-abuse signals and `free_generations_used`.
  - Keeps guard rows for 180 days.
  - Has no client policies; service role only.

- `usage_limits`
  - Stores `user_id` or `anonymous_id_hash`, optional `email_hash` and `ip_hash`, used count, and limit.
  - Authenticated limit is `5`; anonymous limit is `3`.
  - Existing profile backfill sets authenticated rows to `0 / 5`.
  - `user_id` and `anonymous_id_hash` must be unique enough for usage initialization and anonymous usage creation.

- Server env
  - `SUPABASE_SERVICE_ROLE_KEY` is required for admin deletion and private table access.
  - `ACCOUNT_GUARD_HMAC_SECRET` must be at least 32 chars and must never be exposed to client code.

## Invariants

- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `ACCOUNT_GUARD_HMAC_SECRET` through `NEXT_PUBLIC_*`.
- Do not store raw email, IP, or user id in `deleted_user_guards`.
- Keep all access to guard/usage storage server-side.
- Keep `DELETE /api/account` authorization independent from UI visibility.
- Do not use `user_metadata` for authorization decisions.
- Do not let IP-only matches consume or block free usage.
- Run Supabase migrations in order before validating deletion behavior in a real project.

## Edge Cases

- Missing account storage: profile renders usage as unavailable; deletion route returns a 503 with migration guidance.
- Signup succeeds but usage initialization fails: recoverable storage errors are logged and do not crash the registration UI after the email was already sent.
- `usage_limits` conflict-target mismatch: fix migration replaces partial unique indexes with unique constraints for `user_id` and `anonymous_id_hash`.
- Re-registration with the same email: active `deleted_user_guards.email_hash` restores previous used count.
- Repeated profile trigger execution: the trigger uses `on conflict (id) do nothing` to avoid duplicate profile failures.
- Auth deletion failure after guard insertion: the feature attempts to delete the newly inserted guard row.

## Related Features / Impact

- Auth sign-up: `src/features/auth/api/actions.ts` initializes authenticated usage after Supabase creates a user.
- OAuth callback: both default and localized callback routes initialize usage after session exchange.
- Profile page: `/profile` and `/uk/profile` render account details, usage state, and the delete-account entry point.
- Dashboard navigation: sidebar and user menu now link to `/profile`.
- Supabase schema lifecycle: the feature depends on scaffold profile/billing cascade behavior and ordered migrations.
- Tests: account guard, account route, profile view, and e2e protected-route smoke tests cover the feature.

## Change Checklist

- If changing usage uniqueness, confirm Supabase/PostgREST conflict behavior and existing fix migrations remain valid.
- If adding Stripe cleanup, keep financial records anonymized instead of blindly deleting accounting history.
- If adding device tracking, document privacy implications and keep `device_hash` hashed.
- If adding generation APIs, update `usage_limits.free_generations_used` through server-side code only.
- If changing retention, update `DELETED_USER_GUARD_RETENTION_DAYS`, UI copy, and any cleanup job.
- If changing auth routes, keep email/password sign-up and OAuth callback both initializing/restoring usage.
- If editing migrations after they were applied manually in Supabase SQL Editor, add a follow-up migration instead of assuming the previous SQL can be replayed safely.

## Verification

- Type/lint/build:
  - `corepack pnpm typecheck`
  - `corepack pnpm lint`
  - `corepack pnpm build`

- Tests:
  - `corepack pnpm test:run`
  - `corepack pnpm test:e2e`

- Relevant test files:
  - `tests/unit/account-guard.test.ts`
  - `tests/unit/account-route.test.ts`
  - `tests/unit/profile-view.test.tsx`
  - `tests/e2e/app.spec.ts`

- Manual checks:
  - Apply migrations in order in Supabase.
  - Register and confirm a user.
  - Open `/profile` and verify usage state renders.
  - Delete the account by typing the exact email.
  - Re-register with the same email and verify usage is restored from the guard row.

## Last Updated Context

- Date: 2026-05-18
- Reason: Updated documentation to match the revised feature wiki template and current account deletion implementation.
- Change type: Updated
- Affected areas: `wiki/features/account-deletion-anti-abuse.md`, account deletion flow, usage initialization, Supabase migrations, profile route, auth sign-up/OAuth callbacks.
