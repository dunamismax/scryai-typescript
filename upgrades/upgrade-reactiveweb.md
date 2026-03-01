# Agent Prompt: Upgrade reactiveweb

You are scry, a high-agency engineering partner. Read `/Users/sawyer/github/scryai/SOUL.md` and `/Users/sawyer/github/scryai/AGENTS.md` to understand identity and operating rules. Then execute this upgrade.

## Repo

- Path: `/Users/sawyer/github/reactiveweb`
- Package manager: Bun (bun.lock exists)
- Framework: Vite + React Router 7 (framework mode, SPA-first, `ssr: false`)
- Backend: Hono
- Database: Drizzle ORM + Postgres
- Auth: Currently Auth.js (@auth/core) — MUST MIGRATE TO Better Auth

## Current State

- react: ^19.2.0
- react-dom: ^19.2.0
- react-router: ^7.9.5
- @react-router/dev: ^7.9.5
- @react-router/node: ^7.13.1
- tailwindcss: ^4.1.13
- @tailwindcss/vite: ^4.1.13
- vite: ^7.1.3
- typescript: ^5.9.2
- @biomejs/biome: ^1.9.4
- drizzle-orm: ^0.44.6
- drizzle-kit: ^0.31.4
- zod: ^4.1.11
- hono: ^4.7.12
- @auth/core: ^0.34.3 (REMOVE — migrating to Better Auth)
- @radix-ui/react-slot: ^1.2.3
- No TanStack Query
- No shadcn/ui
- react-router.config.ts: ssr: false, appDirectory: "app" (correct)

## Current Auth Architecture (MORE COMPLEX THAN PODDASHBOARD)

- Server auth config: `server/auth.ts`
  - Uses `@auth/core` with Credentials provider
  - Strategy: JWT (NOT database sessions — no DrizzleAdapter)
  - Has JWT callbacks, custom session handling
  - Lockout logic and password change tracking
- Client auth hook: `app/hooks/use-session.tsx`
  - Custom SessionProvider context wrapping the app
- Root integration: SessionProvider wraps app in `root.tsx`

## Tasks

### 1. Bump all dependencies to latest

```bash
cd /Users/sawyer/github/reactiveweb
bun update --latest
```

Versions are mostly current — this should be minor bumps only.

### 2. Remove Auth.js, add Better Auth

```bash
bun remove @auth/core
bun add better-auth
```

### 3. Migrate auth server config

Read the existing `server/auth.ts` carefully. This one uses JWT strategy with custom callbacks, lockout logic, and password change tracking. This is more complex than a simple credentials setup.

Better Auth server setup for this repo:
```tsx
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // existing Drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // Migrate any custom password validation logic here
  },
  session: {
    // Better Auth handles sessions natively — no manual JWT setup needed
    // If the app needs specific session duration or refresh behavior, configure here
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // update session every 24 hours
  },
  // Migrate lockout logic:
  // Better Auth has built-in rate limiting. Check if the existing lockout
  // behavior can be replicated with Better Auth's rateLimit plugin or
  // if custom middleware is needed.
  rateLimit: {
    enabled: true,
  },
});
```

**Important:** The existing JWT strategy means there are no session tables. Better Auth uses database sessions by default, which is better. Generate the required tables:
```bash
bunx @better-auth/cli generate
```

Then apply with Drizzle migrations.

### 4. Migrate auth client

Replace the custom SessionProvider/useSession pattern:

```tsx
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // or your app URL
});

// Use in components:
// const { data: session } = authClient.useSession();
// authClient.signIn.email({ email, password });
// authClient.signOut();
```

Update `root.tsx` to remove the old SessionProvider wrapper.

### 5. Update Hono integration

This repo uses Hono as the backend. Better Auth needs to be mounted in Hono:

```tsx
import { Hono } from "hono";
import { auth } from "./auth";

const app = new Hono();

// Mount Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});
```

Read the existing Hono setup to understand where auth routes are mounted and replicate the pattern with Better Auth.

### 6. Migrate lockout and password change tracking

Read the existing JWT callback logic carefully. The lockout and password change tracking likely:
- Count failed login attempts
- Lock accounts after N failures
- Track password change timestamps

Better Auth may handle some of this natively. For anything custom, implement it as middleware or in the auth configuration. Document any behavior that couldn't be migrated 1:1.

### 7. Add TanStack Query

```bash
bun add @tanstack/react-query
```

Wire up QueryClientProvider in `root.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});
```

### 8. Init shadcn/ui

```bash
bunx shadcn@latest init
```

- Style: New York
- Base color: Neutral
- CSS variables: yes
- Components path: `app/components/ui`
- Utils path: `app/lib/utils`

### 9. Verify

```bash
bun run lint
bun run typecheck
```

### 10. Commit and push

```
chore: migrate to Better Auth, add TanStack Query, shadcn/ui, dep bumps
```

```bash
git -C /Users/sawyer/github/reactiveweb push origin main
```

## Constraints

- Bun only. No npm/pnpm/yarn.
- Do not change `ssr: false` or `appDirectory`.
- Do not rewrite existing non-auth components.
- Better Auth MUST replace Auth.js completely.
- Preserve the lockout and password change tracking behavior — these are security features, not optional.
- Hono integration must work — test the auth endpoints through Hono.
- The Drizzle schema WILL need new tables for Better Auth sessions. Generate and migrate.
- If the auth migration gets too complex, document the state clearly. Do not leave auth half-migrated.
