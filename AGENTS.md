# Project Agent Guide

## Project Overview

This repository is a standalone SaaS scaffold built with Next.js App Router, TypeScript, TailwindCSS 4, shadcn-style local UI components, Supabase Auth/Postgres, Zod, React Hook Form, and Feature-Sliced Design.

The product-specific SaaS features are intentionally not implemented yet. The current goal of the codebase is to provide a scalable foundation for authentication, protected application layout, solo-user account modeling, validation, and future billing integration.

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript with strict mode
- TailwindCSS 4
- shadcn/ui-style source components stored locally in `src/shared/ui`
- Supabase Auth and Postgres via `@supabase/ssr` and `@supabase/supabase-js`
- Zod for validation schemas and inferred types
- React Hook Form with `@hookform/resolvers/zod`
- TanStack Query for client-side async state when needed
- next-themes for theme switching
- lucide-react for icons
- Vitest + React Testing Library for unit/component tests
- Playwright for browser smoke tests
- pnpm via Corepack

## Architecture

The project follows Feature-Sliced Design with `src/views` instead of the standard FSD `pages` layer to avoid confusion with Next.js App Router.

Layer order from highest to lowest:

1. `app/` and `src/app/`
2. `src/views/`
3. `src/widgets/`
4. `src/features/`
5. `src/entities/`
6. `src/shared/`

Import direction must only go downward. Do not import from a same or higher FSD layer. ESLint already enforces the main boundaries.

Important conventions:

- Root `app/` contains Next.js routing, layouts, route handlers, redirects, and error boundaries.
- `src/app/` contains app providers, app-level layouts, config, and global styles.
- `src/views/*` contains page-level composition only.
- `src/widgets/*` contains larger reusable UI blocks.
- `src/features/*` contains user-facing actions and flows.
- `src/entities/*` contains domain schemas, types, and entity-level logic.
- `src/shared/*` contains generic UI, Supabase clients, config, utilities, and shared types.
- Each slice should expose its public API through `index.ts`.
- Avoid deep imports across slices unless importing inside the same slice.

## Key Paths

- `app/layout.tsx`: root HTML layout and app providers.
- `app/(auth)/*`: public auth routes.
- `app/(dashboard)/layout.tsx`: protected dashboard route group.
- `proxy.ts`: Supabase session refresh proxy for Next.js 16.
- `src/app/providers/AppProviders.tsx`: React Query, theme provider, and toaster.
- `src/app/layouts/DashboardLayout.tsx`: protected SaaS dashboard shell.
- `src/app/styles/globals.css`: Tailwind 4 theme tokens and global styles.
- `src/features/auth`: auth schemas, forms, and server actions.
- `src/shared/api/supabase`: Supabase browser/server/proxy helpers.
- `src/shared/config/env.ts`: Zod-validated public environment variables.
- `src/shared/types/database.ts`: typed Supabase database shape.
- `supabase/migrations/20260513143000_initial_saas_scaffold.sql`: initial SaaS database schema and RLS policies.

## Supabase And Auth

Required environment variables are documented in `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The scaffold builds without Supabase env variables. Protected routes redirect to `/sign-in` until the variables are configured.

Auth flows currently scaffolded:

- Email/password sign in
- Email/password sign up
- Google OAuth sign in
- Forgot password
- Reset password
- Sign out
- Auth callback route at `/auth/callback`

Security rules:

- Never expose Supabase service role keys in client code.
- Use server-side `supabase.auth.getUser()` for protected routes.
- Do not make authorization decisions from user-editable `user_metadata`.
- Keep billing authorization data in database tables or app metadata.
- RLS is enabled on all public SaaS tables in the migration.

## Database Baseline

The initial migration creates:

- `profiles`
- `billing_customers`
- `billing_subscriptions`

It also creates:

- billing subscription status enum
- profile creation trigger for new Supabase auth users
- updated-at triggers
- user-scoped RLS policies

Billing is a placeholder only. Stripe Checkout, Customer Portal, and webhooks are not implemented yet.

## Forms And Validation

All user input should use Zod schemas. Prefer colocating schemas in the owning feature/entity.

Current schemas include:

- `signInSchema`
- `signUpSchema`
- `forgotPasswordSchema`
- `resetPasswordSchema`
- `subscriptionStatusSchema`

Client forms use React Hook Form with `zodResolver`. Server actions must validate input again with the same schema or a stricter server schema.

## UI Rules

- Use components from `src/shared/ui` before writing custom markup.
- Use semantic Tailwind tokens such as `bg-background`, `text-muted-foreground`, `border`, `bg-card`.
- Use `gap-*`, not `space-x-*` or `space-y-*`.
- Use lucide icons in buttons where useful.
- Keep the SaaS UI restrained, dense, and work-focused.
- Do not build marketing-heavy pages unless explicitly requested.
- Avoid cards inside cards.
- Keep dashboard and operational UI readable and predictable.

## Commands

Use Corepack pnpm:

```bash
corepack pnpm install
corepack pnpm dev
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test:run
corepack pnpm build
corepack pnpm test:e2e
```

The dev server is expected at:

```text
http://127.0.0.1:3000
```

Playwright e2e uses port `3100` internally.

## Verification Status

The scaffold was verified with:

- `corepack pnpm typecheck`
- `corepack pnpm lint`
- `corepack pnpm test:run`
- `corepack pnpm build`
- `corepack pnpm test:e2e`

All checks passed at the time this guide was created.

## Notes For Future Agents

- Do not rewrite the architecture away from FSD without explicit user approval.
- Keep `/app` route files thin and move page composition to `src/views`.
- If adding new SaaS capabilities, start with entity schemas/types, then features, then widgets/views.
- Keep product and billing data scoped directly to the signed-in user unless the product explicitly becomes team-based later.
- If adding Supabase schema changes, create migrations under `supabase/migrations`.
- If modifying RLS policies, keep access user-scoped with `auth.uid()` unless a new data ownership model is explicitly introduced.
- If adding Stripe later, use the existing `entities/billing` and billing tables as extension points.
- Preserve the current English UI copy unless the user asks to localize.
