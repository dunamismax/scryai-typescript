# Stack Upgrade Checklist

> Temporary tracking document. Remove once all repos are aligned.
> Each repo gets its own agent. Prompt files are in `upgrades/`.

## Target Stack

- Bun (latest) + TypeScript (latest)
- React 19.2 + React Router 7.x (framework mode, SPA-first, `ssr: false`)
- TanStack Query (server state)
- Tailwind CSS 4.x + shadcn/ui
- Drizzle ORM (where DB is used)
- Better Auth (where auth is needed, replaces Auth.js)
- Zod 4.x
- Biome (latest)
- Vite 7.x

## Repos

| Repo | Version Bumps | TanStack Query | shadcn/ui Init | Auth Migration | Status |
|---|---|---|---|---|---|
| mylife-rpg | minor | add | init | n/a | [ ] |
| poddashboard | major (React 19.1->19.2, RR 7.6->latest, Vite 6->7) | add | init | Auth.js -> Better Auth | [ ] |
| repo-monitor | minor | add | init | n/a | [ ] |
| open-video-downloader | major (React 19.1->19.2, RR 7.6->latest, Vite 6->7) | add | init | n/a | [ ] |
| reactiveweb | minor | add | init | Auth.js -> Better Auth | [ ] |
| imaging-services-website | minor | add | init | n/a | [ ] |
| Sawyer-Visual-Media/website | major (React 19.1->19.2, RR 7.6->latest, Vite 6->7, Zod 3->4) | add | init | n/a | [ ] |

## Common Tasks (Every Repo)

1. Bump all deps to latest: `bun update --latest`
2. Add TanStack Query: `bun add @tanstack/react-query`
3. Set up QueryClientProvider in `root.tsx` or equivalent
4. Init shadcn/ui: `bunx shadcn@latest init`
5. Remove stale lockfiles (package-lock.json, yarn.lock) if present
6. Verify: `bun run lint && bun run typecheck`
7. Commit and push

## Auth Migration (poddashboard, reactiveweb)

1. Remove `@auth/core`, `@auth/drizzle-adapter`
2. Add `better-auth`
3. Rewrite auth server config
4. Rewrite auth client hooks
5. Update any session/user type references
6. Verify login flow works

## Done Criteria

All repos pass `bun run lint && bun run typecheck` with the target stack. This file and `upgrades/` are deleted.
