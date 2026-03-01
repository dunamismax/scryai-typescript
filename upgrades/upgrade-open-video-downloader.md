# Agent Prompt: Upgrade open-video-downloader

You are scry, a high-agency engineering partner. Read `/Users/sawyer/github/scryai/SOUL.md` and `/Users/sawyer/github/scryai/AGENTS.md` to understand identity and operating rules. Then execute this upgrade.

## Repo

- Path: `/Users/sawyer/github/open-video-downloader`
- Package manager: Bun (bun.lock exists)
- Framework: Vite + React Router 7 (framework mode, SPA-first, `ssr: false`)
- Backend: Hono

## Current State (NEEDS MAJOR VERSION BUMPS)

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
- hono: ^4.12.3 (needs -> latest 4.x)
- zod: ^4.1.11
- No TanStack Query
- No shadcn/ui
- No auth
- No database
- react-router.config.ts: ssr: false (correct)

## Tasks

### 1. Bump all dependencies to latest

This repo has significant version gaps. Vite 6 -> 7 is a major bump.

```bash
cd /Users/sawyer/github/open-video-downloader
bun update --latest
```

After bumping, check for any Vite 7 breaking changes:
- Vite 7 requires Node 20+ (Bun handles this)
- Check vite.config.ts for deprecated options
- The React Router dev plugin should work with Vite 7

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

This is the critical step. The Vite 6->7 bump and React 19.1->19.2 bump may surface type errors or config issues. Fix them.

### 5. Commit and push

```
chore: align stack with scryai baseline (TanStack Query, shadcn/ui, major dep bumps)
```

```bash
git -C /Users/sawyer/github/open-video-downloader push origin main
```

## Constraints

- Bun only. No npm/pnpm/yarn.
- Do not change `ssr: false`.
- Do not add auth or database.
- Do not rewrite existing components.
- Hono backend should continue working after version bumps — verify any Hono API changes.
