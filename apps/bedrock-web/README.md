# bedrock-web

Production-ready full-stack starter built for the scry stack:

- React Router 7 (Data Mode)
- Bun runtime + Vite
- Tailwind CSS v4 + shadcn-style components
- Better Auth
- PostgreSQL (`postgres.js`) + plain SQL migrations
- MinIO object storage
- pg-boss background jobs

## Features

- Email/password auth with Better Auth mounted at `/api/auth/*`
- Protected route layout and RBAC (`member`, `manager`, `admin`)
- Admin user management (role + account activation)
- Secure defaults: CSP, strict headers, same-origin mutation checks
- Auth form rate limiting
- MinIO file upload flow with asset metadata table
- pg-boss worker scaffold and queue publishing example
- SQL-first data access with `postgres.js`

## Quick Start

1. Install dependencies

```bash
bun install
```

2. Copy env file

```bash
cp .env.example .env
```

3. Start infra from repo root (if not already running)

```bash
bun run infra:up
```

4. Apply DB migrations

```bash
bun run db:migrate
```

5. Start app

```bash
bun run dev
```

6. Optional: promote a user to admin

```bash
BOOTSTRAP_ADMIN_EMAIL=you@example.com bun run db:seed
```

## Scripts

```bash
bun run dev
bun run build
bun run start
bun run typecheck
bun run lint
bun run format
bun run test
bun run db:migrate
bun run db:seed
bun run worker
```

## Project Layout

- `app/routes/` route modules
- `app/lib/` auth, db, security, jobs, storage, RBAC
- `db/migrations/` plain SQL migrations
- `scripts/` migration runner, seed, worker
- `server.ts` Bun production server using React Router request handler

## Notes

- Better Auth user table is extended with `role` and `isActive`.
- `ENABLE_JOBS=true` is required for live pg-boss queueing and worker processing.
- Uploads are persisted to MinIO and indexed in the `asset` table.
