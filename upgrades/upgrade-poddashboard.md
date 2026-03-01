# Agent Prompt: Upgrade poddashboard

You are scry, a high-agency engineering partner. Read `/Users/sawyer/github/scryai/SOUL.md` and `/Users/sawyer/github/scryai/AGENTS.md` to understand identity and operating rules. Then execute this upgrade.

## Repo

- Path: `/Users/sawyer/github/poddashboard`
- Package manager: Bun (bun.lock exists — also has a STALE package-lock.json to DELETE)
- Framework: Vite + React Router 7 (framework mode, SPA-first, `ssr: false`)
- Database: Drizzle ORM + Postgres
- Auth: Currently Auth.js (@auth/core) — MUST MIGRATE TO Better Auth

## Current State (NEEDS MAJOR VERSION BUMPS + AUTH MIGRATION)

- react: ^19.1.0 (needs -> 19.2)
- react-dom: ^19.1.0 (needs -> 19.2)
- react-router: ^7.6.2 (needs -> latest 7.x)
- @react-router/dev: ^7.6.2 (needs -> latest)
- @react-router/node: ^7.6.2 (needs -> latest)
- @react-router/serve: ^7.6.2 (needs -> latest)
- tailwindcss: ^4.1.12 (needs -> latest 4.x)
- @tailwindcss/vite: ^4.1.12 (needs -> latest)
- vite: ^6.3.5 (needs -> 7.x)
- typescript: ^5.9.2
- @biomejs/biome: ^2.2.4
- drizzle-orm: ^0.44.5 (needs -> latest)
- drizzle-kit: ^0.31.4 (needs -> latest)
- zod: ^4.1.11
- @auth/core: ^0.41.0 (REMOVE — migrating to Better Auth)
- @auth/drizzle-adapter: ^1.10.0 (REMOVE — Better Auth has native Drizzle support)
- No TanStack Query
- No shadcn/ui
- react-router.config.ts: ssr: false (correct)

## Current Auth Architecture

- Server auth config: `backend/auth.ts`
  - Uses `@auth/core` with Credentials provider
  - Strategy: `database` via DrizzleAdapter
- Client auth hook: `app/hooks/use-auth.tsx`
  - Custom AuthProvider context wrapping the app
- Root integration: AuthProvider wraps app in `root.tsx`

## Tasks

### 0. Delete stale lockfile

```bash
rm /Users/sawyer/github/poddashboard/package-lock.json
```

### 1. Bump all dependencies to latest

```bash
cd /Users/sawyer/github/poddashboard
bun update --latest
```

### 2. Remove Auth.js, add Better Auth

```bash
bun remove @auth/core @auth/drizzle-adapter
bun add better-auth
```

### 3. Migrate auth server config

Read the existing `backend/auth.ts` to understand the current setup. Then rewrite it for Better Auth.

Better Auth server setup pattern:
```tsx
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your existing Drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // postgres
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Add other providers as needed based on what was in the Auth.js config
});
```

Better Auth requires its own database tables. Generate them:
```bash
bunx @better-auth/cli generate
```

Then apply with your Drizzle migration workflow.

### 4. Migrate auth client

Better Auth provides its own client. Replace the custom AuthProvider/useAuth pattern:

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

Update `root.tsx` to remove the old AuthProvider wrapper. Better Auth's client hooks work without a provider.

### 5. Update route handlers

Better Auth needs an API route. In your React Router app, create a catch-all route for auth:

```tsx
// app/routes/api.auth.$.tsx (or wherever your API routes live)
import { auth } from "../../backend/auth";
import type { Route } from "./+types/api.auth.$";

export async function loader({ request }: Route.LoaderArgs) {
  return auth.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
  return auth.handler(request);
}
```

### 6. Add TanStack Query

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

### 7. Init shadcn/ui

```bash
bunx shadcn@latest init
```

- Style: New York
- Base color: Neutral
- CSS variables: yes
- Components path: `app/components/ui`
- Utils path: `app/lib/utils`

### 8. Verify

```bash
bun run lint
bun run typecheck
```

This repo has the most changes. The Vite 6->7 bump, React 19.1->19.2, AND the auth migration all need to work. Test carefully.

### 9. Commit and push

```
chore: migrate to Better Auth, add TanStack Query, shadcn/ui, major dep bumps
```

```bash
git -C /Users/sawyer/github/poddashboard push origin main
```

## Constraints

- Bun only. No npm/pnpm/yarn.
- Do not change `ssr: false`.
- Do not rewrite existing non-auth components.
- Better Auth MUST replace Auth.js completely — no hybrid state.
- The Drizzle schema may need new tables for Better Auth — generate and migrate them.
- If the auth migration is too complex to complete cleanly, document what's done and what remains. Do not leave the app in a broken state.
