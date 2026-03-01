# Agent Prompt: Upgrade mylife-rpg

You are scry, a high-agency engineering partner. Read `/Users/sawyer/github/scryai/SOUL.md` and `/Users/sawyer/github/scryai/AGENTS.md` to understand identity and operating rules. Then execute this upgrade.

## Repo

- Path: `/Users/sawyer/github/mylife-rpg`
- Package manager: Bun (bun.lock exists)
- Framework: Vite + React Router 7 (framework mode, SPA-first, `ssr: false`)

## Current State

- react: 19.2.0
- react-dom: 19.2.0
- react-router: ^7.9.5
- @react-router/dev: ^7.9.5
- @react-router/node: ^7.13.0
- tailwindcss: ^4.1.13
- @tailwindcss/vite: ^4.1.13
- vite: ^7.1.3
- typescript: ^5.9.2
- @biomejs/biome: ^1.9.4
- drizzle-orm: ^0.44.6
- drizzle-kit: ^0.31.4
- zod: ^4.1.5
- @radix-ui/react-slot: ^1.2.3
- No TanStack Query
- No shadcn/ui (uses raw Radix)
- No auth
- react-router.config.ts: ssr: false (correct)

## Tasks

### 1. Bump all dependencies to latest

```bash
cd /Users/sawyer/github/mylife-rpg
bun update --latest
```

### 2. Add TanStack Query

```bash
bun add @tanstack/react-query
```

Then wire up QueryClientProvider in the app. Find the root layout or `root.tsx` and:

1. Create a QueryClient instance
2. Wrap the app's `<Outlet />` (or children) in `<QueryClientProvider client={queryClient}>`
3. Import from `@tanstack/react-query`

Example pattern:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

// In the layout/root component, wrap children:
<QueryClientProvider client={queryClient}>
  {/* existing app content / Outlet */}
</QueryClientProvider>
```

### 3. Init shadcn/ui

```bash
bunx shadcn@latest init
```

Follow the prompts:
- Style: New York
- Base color: Neutral (or whatever fits the existing theme)
- CSS variables: yes
- Tailwind config: the existing one
- Components path: `app/components/ui`
- Utils path: `app/lib/utils`

This sets up the scaffolding. Do NOT rewrite existing components — just make shadcn available for future use.

### 4. Verify

```bash
bun run lint
bun run typecheck
```

Both must pass clean. If there are type errors from version bumps, fix them.

### 5. Commit and push

Commit message format:
```
chore: align stack with scryai baseline (TanStack Query, shadcn/ui, dep bumps)
```

Push to origin main. This repo should have dual-remote (GitHub + Codeberg). Use:
```bash
git -C /Users/sawyer/github/mylife-rpg push origin main
```

## Constraints

- Bun only. No npm/pnpm/yarn.
- Do not change `ssr: false` in react-router.config.ts.
- Do not add auth — this repo doesn't need it.
- Do not rewrite existing components to use shadcn — just init the CLI.
- Keep changes minimal and focused on stack alignment.
