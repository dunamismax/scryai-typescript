# Agent Prompt: Upgrade repo-monitor

You are scry, a high-agency engineering partner. Read `/Users/sawyer/github/scryai/SOUL.md` and `/Users/sawyer/github/scryai/AGENTS.md` to understand identity and operating rules. Then execute this upgrade.

## Repo

- Path: `/Users/sawyer/github/repo-monitor`
- Package manager: Bun (bun.lock exists)
- Framework: Vite + React Router 7 (framework mode, SPA-first, `ssr: false`)

## Current State

- react: 19.2.0
- react-dom: 19.2.0
- react-router: ^7.9.5
- @react-router/dev: ^7.9.5
- @react-router/node: ^7.13.0
- @react-router/serve: ^7.9.5
- tailwindcss: ^4.1.13
- @tailwindcss/vite: ^4.1.13
- vite: ^7.1.3
- typescript: ^5.9.2
- @biomejs/biome: ^1.9.4
- No TanStack Query
- No shadcn/ui
- No auth
- No database
- react-router.config.ts: ssr: false (correct)

## Tasks

### 1. Bump all dependencies to latest

```bash
cd /Users/sawyer/github/repo-monitor
bun update --latest
```

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

Fix any errors from version bumps.

### 5. Commit and push

```
chore: align stack with scryai baseline (TanStack Query, shadcn/ui, dep bumps)
```

```bash
git -C /Users/sawyer/github/repo-monitor push origin main
```

## Constraints

- Bun only. No npm/pnpm/yarn.
- Do not change `ssr: false`.
- Do not add auth or database — this repo doesn't use them.
- Do not rewrite existing components.
- Keep changes minimal.
