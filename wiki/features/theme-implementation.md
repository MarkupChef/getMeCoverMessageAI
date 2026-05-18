# Theme Implementation

This app uses a custom light/dark/system theme implementation. The main requirement is zero visible theme flash on page reload.

## Files

- `app/layout.tsx` reads the theme cookie on the server and renders the initial `<html>` class.
- `src/shared/lib/theme-config.ts` stores shared theme constants and validation.
- `src/shared/lib/theme-init-script.ts` generates the inline bootstrap script.
- `src/shared/lib/theme.tsx` provides the client-side `ThemeProvider` and `useTheme`.
- `src/app/styles/globals.css` defines light tokens, dark tokens, and system dark fallback CSS.
- `src/features/theme-toggle` contains the user-facing theme switcher.

## Storage Model

The selected theme is persisted in both:

- `localStorage.theme` for fast client-side reads and existing client behavior.
- `theme` cookie for server-rendered HTML.

Valid values are:

- `light`
- `dark`
- `system`

The cookie is required because Server Components cannot read `localStorage`. Without the cookie, the server would always render the light HTML shell, causing a flash before client JavaScript applies the dark class.

## Render Order

1. `app/layout.tsx` reads the `theme` cookie with `cookies()` from `next/headers`.
2. If the cookie is `dark`, the server renders `<html class="... dark">`.
3. If the cookie is `light`, the server renders `<html class="... light">`.
4. If the cookie is missing or `system`, the server does not force a theme class and CSS uses `prefers-color-scheme`.
5. The inline bootstrap script runs as the first element in `<body>`.
6. The bootstrap script syncs old `localStorage.theme` values into the cookie and applies the resolved class before React hydration.
7. After hydration, `ThemeProvider` keeps runtime state, `localStorage`, cookie, cross-tab updates, and system preference changes in sync.

## CSS Behavior

Light theme tokens are defined on `:root`.

Dark theme tokens are applied by:

- `.dark` for explicit dark selection.
- `@media (prefers-color-scheme: dark) { :root:not(.light) { ... } }` for system dark preference.

The `.light` class is an explicit opt-out from system dark CSS. Do not remove it unless the storage and CSS strategy is changed at the same time.

## Rules For Future Changes

- Do not rely only on `useEffect` to apply the theme. Effects run after the first paint and can reintroduce flashing.
- Do not remove the `theme` cookie unless another server-readable source replaces it.
- Keep the valid theme values consistent across `theme-config.ts`, `ThemeProvider`, and the bootstrap script.
- Keep the bootstrap script before page content in `app/layout.tsx`.
- If changing theme token names, update both `.dark` and the system dark media query.

## Verification

Run these checks after changes:

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test:run
corepack pnpm build
```

Relevant unit coverage is in `tests/unit/theme-init-script.test.ts`.
