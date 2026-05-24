# Feature: Anonymous Usage Limiting

## Purpose

Anonymous usage limiting gives guest users two free generation attempts while reducing easy limit resets across browser storage changes. The feature keeps the enforcement server-side, stores only HMAC-hashed technical signals, and avoids hard IP blocking so shared networks do not lose access because of one user's activity.

## Core Decisions

- Decision: Keep `usage_limits.anonymous_id_hash` for compatibility, but store anonymous identity history in `anonymous_usage_identities`.
  Reason: Existing rows can still resolve, while new cookie/device associations have their own lifecycle.

- Decision: Treat `device_hash` as a non-unique lookup signal.
  Reason: Open-source browser fingerprints can collide or change; uniqueness would create false conflicts.

- Decision: Return `signup_required` when one device hash maps to multiple usage rows.
  Reason: Ambiguous fingerprint evidence should not merge unrelated users or grant another anonymous limit.

- Decision: Keep IP as a hashed soft signal only.
  Reason: Universities, offices, and other shared networks can have many real users behind one IP.

- Decision: Consume usage through a database function.
  Reason: The `consume_usage_limit` RPC performs a conditional update in the database so concurrent requests cannot exceed the limit.

## Key Files

- `src/entities/usage/api/usage.ts` - resolves anonymous identities, attaches new cookies to safe matches, and consumes usage.
- `src/features/anonymous-usage/api/actions.ts` - server action that reads/sets the anonymous cookie and calls the usage entity.
- `src/features/anonymous-usage/ui/AnonymousUsageButton.tsx` - hero CTA that lazily loads FingerprintJS and renders exhausted/signup states.
- `src/views/home/ui/HomeView.tsx` - places the guest-only anonymous usage button in the hero.
- `supabase/migrations/20260523173000_anonymous_usage_identities.sql` - creates identity history storage and atomic consume RPC.
- `tests/unit/anonymous-usage.test.ts` - covers cookie, legacy, device, ambiguity, IP-only, and exhausted behavior.

## Runtime Flow

1. A guest clicks `Использовать 1 лимит` on the home hero.
2. The client lazily loads open-source FingerprintJS and sends `visitorId` to the server action.
3. The server action reads the HttpOnly anonymous cookie or creates a new UUID cookie with a 30-day max age.
4. The action hashes the cookie id, device id, and IP with `ACCOUNT_GUARD_HMAC_SECRET`.
5. Usage resolution checks `anonymous_usage_identities.anonymous_id_hash` first.
6. If no identity row exists, legacy `usage_limits.anonymous_id_hash` is checked and backfilled into `anonymous_usage_identities`.
7. If no cookie match exists, active identity rows with the same `device_hash` are inspected.
8. One distinct device-matched usage row attaches the new cookie to that row; multiple distinct rows return `signup_required`.
9. With a resolved usage row, `consume_usage_limit` increments `free_generations_used` only when it is still below `free_generations_limit`.
10. The client updates the button state. At `2 / 2`, the CTA becomes `Upgrade your plan`.

## Data / State Model

- Anonymous limit is `2`, defined by `ANONYMOUS_FREE_GENERATIONS_LIMIT`.
- Anonymous identity retention is `30` days, defined by `ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS`.
- `anonymous_usage_identities.anonymous_id_hash` has a unique partial index for cookie identity.
- `anonymous_usage_identities.device_hash` has a non-unique partial index for lookup only.
- `usage_limits.anonymous_id_hash` remains unique for older rows and compatibility.
- Valid action statuses are `consumed`, `exhausted`, `signup_required`, and `unavailable`.

## Invariants

- Do not make `device_hash` unique.
- Do not merge or block by IP alone.
- Keep raw cookie ids, device ids, and IPs out of the database.
- Keep Supabase service-role access server-side only.
- Keep anonymous usage consumption atomic in the database.
- Preserve legacy lookup until old `usage_limits.anonymous_id_hash` rows are intentionally migrated away.

## Edge Cases

- Missing storage/env returns `unavailable` instead of crashing the hero.
- Legacy anonymous rows are resolved and backfilled into identity history.
- Multiple usage rows for one `device_hash` return `signup_required` without consuming usage.
- Clearing cookies can create a new cookie, but a single matching device hash reattaches it to the existing usage row.
- Open-source FingerprintJS is best-effort and does not guarantee cross-browser identity.

## Related Features / Impact

- Account deletion anti-abuse still owns authenticated usage restoration and the shared HMAC secret.
- Home page tests now cover the anonymous usage CTA.
- Supabase migrations must run before real anonymous usage persistence works.
- Future billing/plan gating should treat `exhausted` as the upgrade path.

## Change Checklist

- If changing limits, update schema constants, migration defaults, tests, and UI copy.
- If changing identity resolution, verify cookie-first, legacy fallback, single-device attach, ambiguous-device signup, and IP-only behavior.
- If adding Turnstile or another bot check, keep it in the server action or real generation endpoint.
- If replacing FingerprintJS OSS with a paid provider, document confidence scoring and privacy implications.
- If pruning expired identities, do not delete active usage rows.

## Verification

- `corepack pnpm typecheck`
- `corepack pnpm lint`
- `corepack pnpm test:run`
- Relevant tests: `tests/unit/anonymous-usage.test.ts`, `tests/unit/home-view.test.tsx`.
- Manual check: start the app, click the hero button twice, confirm the third state shows `Upgrade your plan`.

## Last Updated Context

- Date: 2026-05-23
- Reason: Created documentation for anonymous usage limiting with cookie/device identity history.
- Change type: Created
- Affected areas: anonymous usage entity, anonymous usage feature slice, home hero, Supabase migration, i18n messages, usage tests.
