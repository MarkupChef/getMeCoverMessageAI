# Feature: Anonymous Usage Limiting

## Purpose

Anonymous usage limiting gives guest users two free generation attempts while reducing easy limit resets across browser storage changes. The feature keeps enforcement server-side, stores only HMAC-hashed technical signals, and avoids hard IP blocking so shared networks do not lose access because of one user's activity.

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

- Decision: Read the header counter through a non-consuming snapshot action.
  Reason: A new browser can show the existing remaining credits before the user clicks `Generate`, while brand-new guests do not get database rows until they consume a credit.

## Key Files

- `src/entities/usage/api/usage.ts` - resolves anonymous identities, reads non-consuming snapshots, attaches new cookies to safe matches, and consumes usage.
- `src/features/anonymous-usage/api/actions.ts` - server actions that read/set the anonymous cookie and call the usage entity.
- `src/features/anonymous-usage/model/anonymous-usage-state.tsx` - shared client state for the hero CTA and header counter.
- `src/features/anonymous-usage/ui/AnonymousUsageButton.tsx` - workspace CTA that consumes one free credit and renders exhausted/signup button states.
- `src/features/anonymous-usage/ui/AnonymousUsageCounter.tsx` - guest header counter that displays human-readable credits.
- `src/views/home/ui/HomeView.tsx` - places the guest-only anonymous usage button in the workspace card.
- `src/widgets/site-header/ui/SiteHeader.tsx` - shows the guest free-credit counter next to the sign-in action.
- `supabase/migrations/20260523173000_anonymous_usage_identities.sql` - creates identity history storage and atomic consume RPC.
- `tests/unit/anonymous-usage.test.ts` - covers cookie, legacy, device, ambiguity, IP-only, snapshot, and exhausted behavior.

## Runtime Flow

1. Guest pages mount `AnonymousUsageCounter`, which lazily loads open-source FingerprintJS and requests a non-consuming usage snapshot.
2. The snapshot action reads the HttpOnly anonymous cookie or creates a new UUID cookie with a 30-day max age.
3. The action hashes the cookie id, device id, and IP with `ACCOUNT_GUARD_HMAC_SECRET`.
4. Snapshot resolution checks cookie identity, legacy anonymous usage, and then active `device_hash` matches without creating a `usage_limits` row for brand-new guests.
5. The header shows a skeleton until the snapshot resolves, then renders the remaining count as text such as `2 credits`, `1 credit`, or `0 credits`.
6. A guest clicks `Generate` in the `Your feature workspace` card.
7. Consumption resolution checks `anonymous_usage_identities.anonymous_id_hash` first.
8. If no identity row exists, legacy `usage_limits.anonymous_id_hash` is checked and backfilled into `anonymous_usage_identities`.
9. If no cookie match exists, active identity rows with the same `device_hash` are inspected.
10. One distinct device-matched usage row attaches the new cookie to that row; multiple distinct rows return `signup_required`.
11. With a resolved usage row, `consume_usage_limit` increments `free_generations_used` only when it is still below `free_generations_limit`.
12. The shared client state updates both the workspace CTA and header counter. At `2 / 2`, the CTA becomes `Upgrade Plan`.

## Data / State Model

- Anonymous limit is `2`, defined by `ANONYMOUS_FREE_GENERATIONS_LIMIT`.
- Anonymous identity retention is `30` days, defined by `ANONYMOUS_USAGE_IDENTITY_RETENTION_DAYS`.
- `anonymous_usage_identities.anonymous_id_hash` has a unique partial index for cookie identity.
- `anonymous_usage_identities.device_hash` has a non-unique partial index for lookup only.
- `usage_limits.anonymous_id_hash` remains unique for older rows and compatibility.
- Valid consume action statuses are `consumed`, `exhausted`, `signup_required`, and `unavailable`.
- Valid snapshot action statuses are `available`, `exhausted`, `signup_required`, and `unavailable`.

## Invariants

- Do not make `device_hash` unique.
- Do not merge or block by IP alone.
- Keep raw cookie ids, device ids, and IPs out of the database.
- Keep Supabase service-role access server-side only.
- Keep anonymous usage consumption atomic in the database.
- Keep brand-new snapshots non-consuming and non-persistent in `usage_limits`.
- Preserve legacy lookup until old `usage_limits.anonymous_id_hash` rows are intentionally migrated away.

## Edge Cases

- Missing storage/env returns `unavailable` instead of crashing the hero or header.
- If the header shows `Credits unavailable` and the server logs `PGRST205` for `anonymous_usage_identities`, apply `supabase/migrations/20260523173000_anonymous_usage_identities.sql` to the connected Supabase project.
- Brand-new guest snapshots return `2` remaining without creating a database usage row.
- Legacy anonymous rows are resolved and backfilled into identity history during consumption.
- Multiple usage rows for one `device_hash` return `signup_required` without consuming usage.
- Clearing cookies can create a new cookie, but a single matching device hash reattaches it to the existing usage row during consumption.
- Open-source FingerprintJS is best-effort and does not guarantee cross-browser identity.

## Related Features / Impact

- Account deletion anti-abuse still owns authenticated usage restoration and the shared HMAC secret.
- Home page tests now cover the anonymous usage CTA, exhausted state, unavailable state, skeleton loading, and guest credit counter.
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
- Relevant tests: `tests/unit/anonymous-usage.test.ts`, `tests/unit/home-view.test.tsx`, `tests/unit/site-header.test.tsx`.
- Manual check: start the app, confirm the header shows a skeleton before the snapshot and then `2 credits` next to sign-in, click the workspace `Generate` button twice, and confirm the exhausted state shows `0 credits` and `Upgrade Plan`.

## Last Updated Context

- Date: 2026-05-24
- Reason: Moved generation CTA into the workspace card and added skeleton loading for the guest counter.
- Change type: Updated
- Affected areas: anonymous usage entity, anonymous usage feature slice, app providers, site header, home hero, i18n messages, unit tests.
