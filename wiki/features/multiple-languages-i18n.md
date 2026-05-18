# Feature: Application Internationalization

## Purpose

The app uses `next-intl` to serve English and Ukrainian UI from a single App Router route tree. English is the default locale and stays unprefixed in public URLs, while every non-default locale uses its locale prefix, for example `/uk/dashboard`.

This feature exists to avoid duplicated route branches, keep auth redirects locale-aware, and make future locale additions flow through shared i18n configuration instead of scattered conditional logic.

## Core Decisions

- Decision: Use `localePrefix: "as-needed"`.
  Reason: English canonical URLs must stay unprefixed (`/dashboard`), while Ukrainian uses `/uk/...`.

- Decision: Keep one route tree under `app/[locale]`.
  Reason: The app should not maintain duplicated `(default)` and `[locale]` route branches for every page and route handler.

- Decision: Rewrite unprefixed English requests internally to `/en/...` in `proxy.ts`.
  Reason: Next.js still needs the `[locale]` segment to resolve the route, but users and crawlers should see canonical unprefixed English URLs.

- Decision: Redirect public `/en` and `/en/...` requests to unprefixed canonical URLs.
  Reason: English has exactly one canonical URL shape, which avoids duplicate SEO surfaces.

- Decision: Keep locale labels, locales, and localized path building in `src/shared/i18n`.
  Reason: Components and server actions should depend on one typed i18n contract rather than hand-built URL prefixes.

- Decision: Continue Supabase session refresh inside the same proxy flow.
  Reason: i18n routing must not drop auth cookies or bypass protected-route session behavior.

## Key Files

- `proxy.ts` - canonicalizes `/en/...`, rewrites unprefixed English routes to `/en/...`, detects non-default locale prefixes, bypasses `/api/...`, and preserves Supabase session refresh.
- `app/layout.tsx` - owns the root `<html>`, imports global CSS, and sets `lang` from the locale header written by proxy.
- `app/[locale]/layout.tsx` - validates locale params, loads messages, sets the request locale, and wraps pages in `NextIntlClientProvider` and app providers.
- `app/[locale]/(auth)/*` - locale-scoped auth pages and route handlers that also serve unprefixed English through proxy rewrites.
- `app/[locale]/(dashboard)/*` - locale-scoped protected routes and dashboard pages.
- `src/shared/i18n/routing.ts` - defines `locales`, `defaultLocale`, `localePrefix`, `localeLabels`, `getLocalizedPath`, and locale validation.
- `src/shared/i18n/navigation.ts` - exports locale-aware navigation helpers from `next-intl`.
- `src/shared/i18n/request.ts` - loads the message bundle for the active request locale.
- `src/shared/i18n/messages/en.ts` - English message contract and source shape for strong message typing.
- `src/shared/i18n/messages/uk.ts` - Ukrainian messages checked against the English message shape.
- `src/features/language-switcher/ui/LanguageSwitcher.tsx` - client language selector rendered from `routing.locales` and `localeLabels`.
- `tests/unit/i18n-routing.test.ts` - unit coverage for localized path rules and locale label alignment.
- `tests/e2e/app.spec.ts` - browser coverage for canonical redirects, auth redirects, OAuth route shape, and language switching.

## Runtime Flow

1. A request enters `proxy.ts`.
2. `/api` and `/api/...` bypass locale rewriting and only run Supabase session refresh.
3. Public `/en` or `/en/...` requests redirect to the unprefixed canonical path.
4. Requests with a non-default locale prefix, currently `/uk` or `/uk/...`, continue to the matching `app/[locale]` route.
5. Unprefixed app routes, such as `/`, `/sign-in`, or `/dashboard`, are treated as English and internally rewritten to `/en`, `/en/sign-in`, or `/en/dashboard`.
6. Proxy writes the active locale into the `x-next-intl-locale` request header and passes the response through `updateSession`.
7. `app/layout.tsx` reads the locale header and sets `<html lang>`.
8. `app/[locale]/layout.tsx` validates the locale, calls `setRequestLocale`, loads messages, and mounts `NextIntlClientProvider`.
9. Pages, forms, dashboard shell, auth messages, and the language switcher read translations through `next-intl`.
10. The language switcher uses locale-aware router replacement, so `/dashboard` can switch to `/uk/dashboard` and `/uk/dashboard` can switch back to `/dashboard`.

## Data / State Model

- Valid locale state lives in `routing.locales`; current values are `en` and `uk`.
- `routing.defaultLocale` is `en`; it is the only locale without a public URL prefix.
- `localeLabels` must contain exactly one label per configured locale.
- Message keys are typed from the English message object. Ukrainian must satisfy the same shape.
- No locale cookie or browser locale detection is used. The URL structure is the source of truth.
- Supabase auth state remains cookie-based and is refreshed by `updateSession` in proxy.

## Invariants

- Do not recreate `app/(default)` or another duplicated default-locale route tree.
- Keep user-facing pages and auth route handlers under `app/[locale]`.
- Keep English URLs canonical and unprefixed.
- Redirect `/en` and `/en/...` to their unprefixed equivalents.
- Prefix every non-default locale URL with its locale code.
- Do not hand-build localized URLs in server redirects; use `getLocalizedPath`.
- Do not hardcode language switcher options; render from `routing.locales` and `localeLabels`.
- Keep `/api/...` routes out of locale rewrites.
- Preserve Supabase session refresh when changing proxy behavior.

## Edge Cases

- `/en` redirects to `/`.
- `/en/sign-in` redirects to `/sign-in`.
- `/dashboard` internally resolves through `/en/dashboard` but remains visible as `/dashboard`.
- `/uk/dashboard` stays visible as `/uk/dashboard`.
- Unauthenticated `/dashboard` redirects to `/sign-in`.
- Unauthenticated `/uk/dashboard` redirects to `/uk/sign-in`.
- Google OAuth form action is `/auth/google` for English and `/uk/auth/google` for Ukrainian.
- Sign out redirects to `/sign-in` for English and `/uk/sign-in` for Ukrainian.
- Internal English rewrites must not be mistaken for public `/en/...` requests, otherwise redirect loops can occur.

## Related Features / Impact

- Secure registration: sign-up, email confirmation, OAuth callback, and reset-password redirect URLs must use localized auth routes without exposing `/en` publicly.
- Dashboard protection: unauthenticated redirects must resolve to `/sign-in` for English and `/uk/sign-in` for Ukrainian.
- Account deletion and sign-out: post-action redirects must preserve the active locale and continue to work through the shared auth route handlers.
- Supabase Auth: callback and OAuth routes are served from `app/[locale]` while English remains public as `/auth/...`.
- Theme and app providers: root `<html>` is owned by `app/layout.tsx`, while locale-scoped providers stay in `app/[locale]/layout.tsx`.
- Tests: canonical routing, language switching, auth route shape, and protected redirects are covered by `tests/e2e/app.spec.ts` and `tests/unit/i18n-routing.test.ts`.

## Change Checklist

- When adding a locale:
  - Add it to `routing.locales`.
  - Add a `localeLabels` entry.
  - Add a typed message file with the same shape as `messages/en.ts`.
  - Confirm `proxy.ts` detects the new non-default prefix without hardcoding.
  - Update tests where user-visible labels or expected localized URLs change.

- When adding a route:
  - Add it under `app/[locale]`.
  - Use locale-aware links/navigation for user-facing routes.
  - Use `getLocalizedPath` in server redirects and auth callback URLs.
  - Add English and non-default locale e2e coverage if the route affects navigation or auth.

- When changing auth:
  - Verify callback, OAuth, sign-out, protected redirect, and reset-password flows for both English and Ukrainian paths.
  - Keep Supabase redirect allowlist compatible with both unprefixed and prefixed callback URLs.

- When changing proxy:
  - Re-test canonical `/en` redirects.
  - Re-test unprefixed English routes for redirect loops.
  - Re-test `/api/...` behavior.
  - Confirm Supabase cookies are still refreshed.

## Verification

- Static checks:
  - `corepack pnpm typecheck`
  - `corepack pnpm lint`
  - `corepack pnpm build`

- Tests:
  - `corepack pnpm test:run`
  - `corepack pnpm test:e2e`

- Relevant automated coverage:
  - `tests/unit/i18n-routing.test.ts`
  - `tests/unit/auth-actions.test.ts`
  - `tests/unit/auth-forms.test.tsx`
  - `tests/unit/user-menu.test.tsx`
  - `tests/e2e/app.spec.ts`

- Manual checks:
  - Open `/` and confirm English content with no `/en` prefix.
  - Open `/uk` and confirm Ukrainian content.
  - Open `/en` and confirm redirect to `/`.
  - Open `/en/sign-in` and confirm redirect to `/sign-in`.
  - Switch `/dashboard` to Ukrainian and confirm `/uk/dashboard`.
  - Switch `/uk/dashboard` back to English and confirm `/dashboard`.

## Last Updated Context

- Date: 2026-05-18
- Reason: Updated the i18n feature wiki to match the current `feature-wiki-doc` structure and document cross-feature impact.
- Change type: Updated
- Affected areas: `wiki/features/multiple-languages-i18n.md`, i18n routing, auth redirects, dashboard protection, Supabase auth callbacks, language switcher tests.
