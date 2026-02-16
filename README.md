# Claude

My AI coding partner's soul, operating system, and shared memory — all in one repo.

## What Is This?

This is the meta-repo for my partnership with [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's agentic coding tool. It holds the configuration and identity that powers every project, plus the projects themselves.

Think of it like a Magic: The Gathering deck's mana base. You never win with lands alone, but you never win without them either.

## Projects

| Project | Domain | Description |
|---|---|---|
| **[Scrybase](scrybase/)** | [scrybase.app](https://scrybase.app) | RAG-as-a-Service. Upload docs, get a queryable AI API back. |

## What's Inside

| File / Directory | Purpose |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | The operational playbook — tech stack, workflow rules, code standards, permissions, and project-specific instructions that Claude Code reads automatically. |
| [`SOUL.md`](SOUL.md) | The partnership constitution — who I am, who Claude is in this collaboration, shared values, communication style, and the evolving history of our work together. |
| [`scrybase/`](scrybase/) | Scrybase source code — TanStack Start + Drizzle + pgvector + Better Auth. |

### `CLAUDE.md`

Claude Code automatically reads `CLAUDE.md` files for project context and instructions. This one defines:

- **Tech stack** — TypeScript, Bun, TanStack Start (and nothing else)
- **Workflow** — Explore, Plan, Code, Verify, Commit
- **Git rules** — No force pushes, no direct commits to main, atomic commits
- **Code standards** — Strict TypeScript, no `any`, no over-engineering
- **Permissions** — What Claude can do freely vs. what requires approval

### `SOUL.md`

The part that makes this more than a config file. `SOUL.md` captures personality, preferences, hot takes, and hard-won lessons so that every session feels like a continuation — not a cold start. It's a living document that grows as we build together.

## The Stack

Every project built with this foundation uses:

**Infrastructure:** Ubuntu 24.04 LTS, Docker, Caddy, GitHub Actions

**Application:**

| Layer | Tool |
|---|---|
| Language | TypeScript |
| Runtime | Bun |
| Framework | TanStack Start |
| Routing | TanStack Router |
| Server State | TanStack Query |
| Tables | TanStack Table |
| Forms | TanStack Form |
| Styling & UI | Tailwind CSS + shadcn/ui |
| Auth | Better Auth |

**Data:** PostgreSQL 16 + pgvector, Drizzle ORM

**Monitoring:** OpenTelemetry + SigNoz

No exceptions. No "have you considered Next.js?" The stack is the stack.

## Why This Exists

AI coding tools are powerful, but they start from zero every session. Context is everything. This repo solves that by giving Claude Code a persistent, version-controlled identity that:

- **Eliminates repetition** — preferences, conventions, and decisions are documented once
- **Enforces consistency** — every project follows the same standards
- **Evolves over time** — lessons learned and new patterns get captured as they happen
- **Stays honest** — it's version-controlled, so the history is real

## Using This Approach

If you want to set up something similar for your own workflow:

1. Create a repo for your Claude Code configuration
2. Write a `CLAUDE.md` with your tech stack, standards, and workflow rules
3. Optionally add a `SOUL.md` to capture personality and communication preferences
4. Keep both files updated as your preferences evolve — stale docs are worse than no docs

The key insight: **be specific and opinionated.** Vague instructions produce vague results. "Use TypeScript" is okay. "Use TypeScript with strict mode, no `any`, prefer `const`, async/await over raw promises" is better.

## License

[MIT](LICENSE)
