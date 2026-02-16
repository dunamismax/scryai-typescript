# Apps

All product applications live under `apps/`.

## Convention

- One app per directory: `apps/<app-name>/`
- Each app is end-to-end TypeScript and runs on Bun.
- Each app owns its own `package.json`, env file, and runtime config.
- Shared infra stays in root `infra/`.

## Current Apps

- `bedrock-template` — full-stack secure Qwik + Qwik City starter template (Bun, Tailwind v4, Better Auth, postgres.js, MinIO, pg-boss)
