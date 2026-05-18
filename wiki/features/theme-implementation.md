# Feature: Theme Implementation

## Purpose

The theme feature lets users choose `light`, `dark`, or `system` appearance without a visible flash on reload. It exists because client-only theme application runs too late for the first paint in a server-rendered Next.js App Router app.

The current implementation makes the initial theme server-readable, then keeps the browser state synchronized after hydration.

## Core Decisions

- Decision: Persist the selected theme in both `localStorage.theme` and a `theme` cookie.
  Reason: `localStorage` is useful on the client, but Server Components can only read request cookies. The cookie allows `app/layout.tsx` to render the correct initial `<html>` class.

- Decision: Render explicit `dark` and `light` classes on `<html>` from the server when the cookie contains an explicit user choice.
  Reason: The first HTML/CSS paint must already match the saved theme; React effects and client scripts are too late to be the only source of truth.

- Decision: Keep a tiny inline bootstrap script as the first element in `<body>`.
  Reason: It migrates older `localStorage.theme` values into the cookie and applies the resolved class before React hydration.

- Decision: Use CSS `prefers-color-scheme` fallback for `system`.
  Reason: The server cannot know the browser's system theme, so CSS must handle the first paint when no explicit `light` or `dark` class is present.

- Decision: Keep `.light` as an explicit opt-out from system dark CSS.
  Reason: Users who choose light mode must not receive dark tokens from `prefers-color-scheme: dark`.

## Key Files

- `app/layout.tsx` - reads the `theme` cookie with `cookies()` and renders initial `<html>` class/style.
- `src/shared/lib/theme-config.ts` - stores valid theme values, storage key, cookie max age, default theme, and media query.
- `src/shared/lib/theme-init-script.ts` - generates the inline pre-hydration script.
- `src/shared/lib/theme.tsx` - provides `ThemeProvider`, `useTheme`, runtime DOM updates, storage sync, and system preference subscription.
- `src/app/styles/globals.css` - defines light tokens, `.dark` tokens, and system dark CSS fallback.
- `src/features/theme-toggle` - user-facing theme selection UI.
- `tests/unit/theme-init-script.test.ts` - covers pre-hydration script behavior and cookie synchronization.

## Runtime Flow

1. The browser requests a page and sends the `theme` cookie if it exists.
2. `app/layout.tsx` reads the cookie with `cookies()` from `next/headers`.
3. If the cookie is `dark`, the server renders `<html class="... dark">` and `color-scheme: dark`.
4. If the cookie is `light`, the server renders `<html class="... light">` and `color-scheme: light`.
5. If the cookie is missing or `system`, the server does not force a theme class; CSS handles system preference through `prefers-color-scheme`.
6. The inline bootstrap script runs before the app content hydrates.
7. The bootstrap script reads `localStorage.theme` and the `theme` cookie, validates the value, writes the cookie when needed, and applies `.dark` or `.light`.
8. After hydration, `ThemeProvider` initializes from `localStorage`, subscribes to system theme changes, applies DOM classes, and persists future user selections to both storage locations.
9. Cross-tab changes are handled through the browser `storage` event.

## Data / State Model

- Valid theme values: `light`, `dark`, `system`.
- Default theme: `system`.
- Client storage: `localStorage.theme`.
- Server-readable storage: `theme` cookie.
- Derived runtime value: `resolvedTheme`, either `light` or `dark`.
- Cookie lifetime: defined by `THEME_COOKIE_MAX_AGE` in `src/shared/lib/theme-config.ts`.

The cookie and `localStorage` must represent the same selected theme after the first client run. If only `localStorage` exists from an older version, the bootstrap script copies it into the cookie.

## Invariants

- Do not rely only on `useEffect` to apply the initial theme.
- Keep the `theme` cookie server-readable unless another SSR-compatible source replaces it.
- Keep `localStorage.theme`, the `theme` cookie, and `ThemeProvider` valid values aligned.
- Keep the bootstrap script before page content in `app/layout.tsx`.
- Keep `.light` if system dark fallback CSS remains based on `:root:not(.light)`.
- Update both `.dark` and the system dark media query when changing theme token names.

## Edge Cases

- Missing cookie: first paint uses system-aware CSS fallback.
- Explicit light theme with dark OS preference: `.light` prevents system dark CSS from applying.
- Existing users with only `localStorage.theme`: bootstrap script writes the missing cookie.
- Invalid stored value: ignored and treated as default `system`.
- `localStorage` access failure: caught by the bootstrap script and provider.
- Browser system theme changes while `theme === "system"`: `useSyncExternalStore` updates the resolved theme.

## Related Features / Impact

- Dashboard shell and auth pages rely on global theme tokens from `src/app/styles/globals.css`.
- `ThemeToggle` depends on `useTheme` and the valid theme value union.
- Next.js root layout now uses `cookies()`, so the app routes are dynamically rendered on demand.
- Unit tests include `tests/unit/theme-init-script.test.ts`.

## Change Checklist

- Verify that reloads in explicit dark mode do not show a light frame.
- Verify that reloads in explicit light mode stay light even when the OS is dark.
- Verify that `system` follows the OS theme on first paint and after hydration.
- Check that `theme` cookie is updated when the user changes theme.
- Check that `localStorage.theme` remains backwards compatible.
- If changing CSS tokens, update explicit `.dark` and system dark fallback together.
- If moving the provider or root layout logic, confirm FSD import direction stays valid.

## Verification

Run:

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test:run
corepack pnpm build
```

Relevant automated test:

- `tests/unit/theme-init-script.test.ts`

Manual smoke checks:

- Select dark theme, reload, and confirm there is no light flash.
- Select light theme on a dark OS, reload, and confirm there is no dark flash.
- Select system theme, change OS/browser color scheme, and confirm the app follows it.

## Last Updated Context

- Date: 2026-05-18
- Reason: Documented the no-flash theme architecture after implementing SSR cookie-based initial theme rendering.
- Change type: Created
- Affected areas: `app/layout.tsx`, `src/shared/lib/theme-config.ts`, `src/shared/lib/theme-init-script.ts`, `src/shared/lib/theme.tsx`, `src/app/styles/globals.css`, `src/features/theme-toggle`, `tests/unit/theme-init-script.test.ts`
