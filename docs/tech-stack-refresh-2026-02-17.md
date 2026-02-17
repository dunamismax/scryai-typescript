# Tech Stack Refresh - 2026-02-17

This document records the stack decisions approved on February 17, 2026.

## Decisions Applied

1. Production Node runtime baseline moved from Node.js 22 LTS to Node.js 24 LTS.
2. Database baseline moved to PostgreSQL 18 (with `pgvector` + `pgcrypto`).
3. Mainline Astro posture remains latest stable Astro 5.x; Astro 6 runs in a pilot lane until GA and passing verification gates.
4. MinIO OSS removed from local infra baseline and replaced with SeaweedFS S3-compatible storage.

## Why

- Node.js 24 is the current Active LTS line, while Node.js 22 is in Maintenance LTS.
- PostgreSQL 18 is the current major release line.
- Astro 6 is in beta; running a pilot lane keeps velocity without adding mainline stability risk.
- MinIO OSS upstream is archived/unmaintained; SeaweedFS keeps the stack self-hostable and S3-compatible.

## Repo-Level Changes

- `infra/docker-compose.yml`
  - `pgvector/pgvector:pg16` -> `pgvector/pgvector:pg18`
  - MinIO services replaced with `chrislusf/seaweedfs` S3-enabled service
- `infra/.env.example`
  - MinIO variables replaced with SeaweedFS storage variables
- `scripts/setup-storage.ts`
  - New storage setup entrypoint replacing `scripts/setup-minio.ts`
- `scripts/bootstrap.ts`
  - Infra bootstrap now calls `bun run setup:storage`
- `package.json`
  - Script renamed to `setup:storage`
  - Tooling baseline updated (`@biomejs/biome`, `@types/bun`)
- `AGENTS.md` and `SOUL.md`
  - Updated stack policy and identity-level stack convictions

## Verification Commands

Run from `~/github/scryai`:

```bash
bun install
bun run lint
bun run typecheck
bun run test
docker compose --env-file infra/.env.example -f infra/docker-compose.yml config
```

## External References

- Node.js release schedule and status: https://nodejs.org/en/about/previous-releases
- PostgreSQL 18 release: https://www.postgresql.org/about/news/postgresql-18-released-3142/
- PostgreSQL versioning: https://www.postgresql.org/support/versioning/
- Astro 5.17 release: https://astro.build/blog/astro-5170/
- Astro 6 beta release: https://astro.build/blog/astro-6-beta/
- MinIO OSS repository (archived): https://github.com/minio/minio
- SeaweedFS repository: https://github.com/seaweedfs/seaweedfs
