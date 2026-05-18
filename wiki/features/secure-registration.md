# Feature: Secure Registration

## Purpose

This feature makes user registration safe against email enumeration while keeping account side effects idempotent. The public sign-up flow must not reveal whether an email already belongs to an existing password account or OAuth account. Profile and usage records are only initialized after Supabase confirms a real authenticated user session.

## Core Decisions

- Decision: Existing-email sign-up returns the same neutral success as new-email sign-up.
  Reason: Showing a duplicate-account error would disclose whether a specific email is registered.

- Decision: `signUpAction` does not perform admin email lookup.
  Reason: Supabase Auth remains the source of truth for uniqueness and identity linking, and admin lookup would add an enumeration surface.

- Decision: Raw Supabase sign-up errors are never shown to the client.
  Reason: Provider messages can contain account-existence or implementation details. Technical failures are reduced to generic retry copy.

- Decision: Usage initialization moved out of sign-up and remains in `/auth/callback`.
  Reason: Supabase can return obfuscated sign-up users for existing emails; only the callback session proves the user is real.

- Decision: Authenticated usage initialization uses `upsert` with `onConflict: "user_id"` and `ignoreDuplicates: true`.
  Reason: Callback execution can repeat, and usage creation must not race or duplicate rows.

- Decision: Profile creation trigger uses `on conflict (id) do nothing`.
  Reason: Repeated profile initialization should be harmless instead of failing on duplicate primary keys.

## Key Files

- `src/features/auth/api/actions.ts` - validates sign-up input, calls Supabase Auth, normalizes duplicate-like sign-up errors to neutral success, and hides raw provider errors.
- `src/features/auth/ui/SignUpForm.tsx` - client form that shows Zod validation errors and server action success/error toasts.
- `app/[locale]/(auth)/auth/callback/route.ts` - exchanges Supabase auth code for a real session and initializes usage only when `data.user.email` exists.
- `src/entities/usage/api/usage.ts` - initializes authenticated usage from deleted-user guards with idempotent `user_id` upsert.
- `supabase/migrations/20260517231011_make_profile_trigger_idempotent.sql` - makes `public.handle_new_user()` safe to rerun.
- `src/shared/i18n/messages/en.ts` and `src/shared/i18n/messages/uk.ts` - neutral sign-up success and generic technical failure copy.
- `tests/unit/auth-actions.test.ts` - verifies duplicate-safe sign-up behavior and hidden raw errors.
- `tests/unit/account-guard.test.ts` - verifies idempotent profile trigger migration and usage upsert behavior.
- `tests/unit/auth-forms.test.tsx` - verifies the form shows the neutral success message.

## Runtime Flow

1. The user submits the sign-up form.
2. Client-side React Hook Form and Zod validation show normal validation errors for empty fields, invalid email, password length, or password mismatch.
3. `signUpAction` repeats server-side schema validation.
4. If public Supabase env is missing, the action returns an auth-not-configured error.
5. The action calls `supabase.auth.signUp()` with email, password, redirect URL, and `full_name` metadata.
6. If Supabase returns a duplicate-like error, the action returns neutral success: `Check your inbox. If an account can be created, we sent an email to continue.`
7. If Supabase returns another technical error, the action logs only sanitized error metadata server-side and returns generic retry copy.
8. The sign-up action never creates profile or usage records.
9. When the user follows a Supabase email/OAuth callback, `/auth/callback` exchanges the code for a session.
10. If a real `data.user.email` exists, usage initialization runs idempotently by `user_id`.
11. Profile creation is handled by the Supabase database trigger and is idempotent through `on conflict (id) do nothing`.

## Data / State Model

- Supabase Auth owns user uniqueness and provider identity linking.
- `public.profiles.id` mirrors `auth.users.id` and is created by the `handle_new_user` trigger.
- `public.usage_limits.user_id` is unique and is the conflict target for authenticated usage initialization.
- `deleted_user_guards.email_hash` can restore prior free usage for re-registration without exposing raw email.
- Sign-up UI state is transient; the public result intentionally does not encode whether the account exists.

## Invariants

- Do not show duplicate/existing-email errors in the sign-up UI.
- Do not show raw `Supabase error.message` from sign-up.
- Keep validation errors visible for malformed input and weak local password rules.
- Do not initialize `profiles` or `usage_limits` from a sign-up response.
- Only initialize usage after `/auth/callback` has a real Supabase user.
- Keep `usage_limits` authenticated initialization atomic and keyed by `user_id`.
- Do not add admin email lookup to registration unless the privacy model is intentionally redesigned.

## Edge Cases

- Existing password email: returns neutral success.
- Existing OAuth-linked email: returns neutral success and relies on Supabase identity linking.
- Obfuscated successful sign-up response: no usage side effect is created.
- Technical Supabase failure: returns generic retry copy and logs sanitized metadata.
- Repeated auth callback: usage upsert ignores the duplicate `user_id`.
- Repeated profile trigger execution: profile insert does nothing on existing `id`.

## Related Features / Impact

- Account deletion anti-abuse: re-registration can restore prior usage from `deleted_user_guards.email_hash`.
- Usage limits: authenticated usage is initialized only after callback and must remain idempotent by `user_id`.
- Supabase Auth providers: password and Google OAuth must both avoid pre-checking email existence.
- Internationalization: signup success and generic technical failure copy live in `src/shared/i18n/messages/en.ts` and `src/shared/i18n/messages/uk.ts`.
- Tests: signup behavior is covered by `tests/unit/auth-actions.test.ts`, `tests/unit/auth-forms.test.tsx`, and `tests/unit/account-guard.test.ts`.

## Change Checklist

- If changing sign-up copy, keep it neutral and avoid confirming whether an account exists.
- If changing Supabase Auth handling, preserve duplicate-like error normalization.
- If adding more providers, keep provider flows free of email pre-checks.
- If changing callback behavior, keep side effects guarded by real `data.user`.
- If changing usage uniqueness, update the `onConflict` target and tests together.
- If modifying profile triggers, keep `on conflict (id) do nothing`.

## Verification

- Focused tests:
  - `corepack pnpm test:run tests/unit/auth-actions.test.ts tests/unit/auth-forms.test.tsx tests/unit/account-guard.test.ts`

- Regression checks:
  - `corepack pnpm typecheck`
  - `corepack pnpm lint`
  - `corepack pnpm test:run`

- Manual checks:
  - Apply `supabase/migrations/20260517231011_make_profile_trigger_idempotent.sql` in Supabase.
  - Sign up with a new email and confirm the neutral success message appears.
  - Sign up again with the same email and confirm the same neutral success appears.
  - Complete the email/OAuth callback and verify one profile and one usage row exist for the user.
  - Repeat the callback or re-open the confirmation link and verify no duplicate profile or usage rows are created.

## Last Updated Context

- Date: 2026-05-18
- Reason: Documented the current secure-registration implementation after adding email-enumeration-safe signup responses and idempotent profile/usage initialization.
- Change type: Updated
- Affected areas: `src/features/auth/api/actions.ts`, `src/entities/usage/api/usage.ts`, `/auth/callback`, Supabase profile trigger migration, signup i18n copy, auth and usage tests.
