# Web Template

## Purpose

`app/` is the canonical Next.js App Router reference surface for this repository. It demonstrates stack defaults and acts as the baseline implementation target for future UI or control-plane features.

## Intent

- Show end-to-end Bun + Next.js + TypeScript integration.
- Keep server actions, validation, and UI composition patterns explicit.
- Preserve deterministic setup and verification gates.

## Baseline

- App Router routes under `app/`.
- Server Actions with Zod validation.
- Tailwind + shadcn/ui component style.
- Postgres + Drizzle schema/client foundations in `lib/db/`.
- Auth.js wiring scaffold in `auth.ts` and `app/api/auth/[...nextauth]/route.ts`.

## Verification Gates

- `bun run lint`
- `bun run typecheck`
- `bun test`
- `bun run build`
