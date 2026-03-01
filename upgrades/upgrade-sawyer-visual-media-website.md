# Agent Prompt: Upgrade Sawyer-Visual-Media/website

You are scry, a high-agency engineering partner. Read `/Users/sawyer/github/scryai/SOUL.md` and `/Users/sawyer/github/scryai/AGENTS.md` to understand identity and operating rules. Then execute this upgrade.

## Repo

- Path: `/Users/sawyer/github/Sawyer-Visual-Media/website`
- Package manager: Bun (bun.lock exists)
- Framework: Vite + React Router 7 (framework mode, SPA-first, `ssr: false`)

## Current State (NEEDS MAJOR VERSION BUMPS)

- react: ^19.1.0 (needs -> 19.2)
- react-dom: ^19.1.0 (needs -> 19.2)
- react-router: ^7.6.1 (needs -> latest 7.x)
- @react-router/dev: ^7.6.1 (needs -> latest)
- @react-router/node: ^7.6.1 (needs -> latest)
- @react-router/serve: ^7.6.1 (needs -> latest)
- tailwindcss: ^4.1.7 (needs -> latest 4.x)
- @tailwindcss/vite: ^4.1.7 (needs -> latest)
- vite: ^6.3.5 (needs -> 7.x)
- typescript: ^5.8.3 (needs -> latest 5.x)
- @biomejs/biome: ^1.9.4
- zod: ^3.25.3 (needs -> 4.x — MAJOR MIGRATION)
- @radix-ui/react-slot: ^1.2.3
- No TanStack Query
- No shadcn/ui
- No auth
- No database
- react-router.config.ts: ssr: false (correct)

## Tasks

### 1. Bump all dependencies to latest

This repo has the most version gaps. Vite 6->7, Zod 3->4, React 19.1->19.2.

```bash
cd /Users/sawyer/github/Sawyer-Visual-Media/website
bun update --latest
```

**Zod 3 -> 4 migration notes:**
- Zod 4 is largely backward compatible but check for:
  - `z.coerce.*` API changes
  - `.transform()` chain differences
  - Any `.parse()` calls that rely on Zod 3-specific error shapes
- Search the codebase for all Zod usage and verify compatibility

### 2. Add TanStack Query

```bash
bun add @tanstack/react-query
```

Wire up QueryClientProvider in the root layout or `root.tsx`:

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

Wrap the app content in `<QueryClientProvider client={queryClient}>`.

### 3. Init shadcn/ui

```bash
bunx shadcn@latest init
```

- Style: New York
- Base color: Neutral
- CSS variables: yes
- Components path: `app/components/ui`
- Utils path: `app/lib/utils`

Do NOT rewrite existing components.

### 4. Verify

```bash
bun run lint
bun run typecheck
```

This repo has the most risk from the Zod 3->4 migration. Check all Zod schemas carefully. Fix any type errors.

### 5. Commit and push

```
chore: align stack with scryai baseline (TanStack Query, shadcn/ui, Zod 4, major dep bumps)
```

```bash
git -C /Users/sawyer/github/Sawyer-Visual-Media/website push origin main
```

## Constraints

- Bun only. No npm/pnpm/yarn.
- Do not change `ssr: false`.
- Do not add auth or database — this is a static portfolio site.
- Do not rewrite existing components.
- Pay special attention to the Zod 3->4 migration.
