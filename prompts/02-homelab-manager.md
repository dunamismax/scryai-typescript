# Self-Hostable AI Homelab Manager — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **Homelab Manager** — a self-hostable AI operations agent for home infrastructure. It manages Docker containers, system updates, SSL certificates, DNS, backups, and health checks through a natural language interface and autonomous monitoring. Think of it as an AI sysadmin that understands your entire stack and acts on your behalf — or proposes changes and waits for approval based on risk level.

Target audience: self-hosters running Docker-based infrastructure on Linux servers. The r/selfhosted community (500k+ members) is the primary distribution channel.

This is a real product intended for public release and open-source distribution. Build it production-grade from the start.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Backend:** Bun server with Hono
- **Database:** Postgres with Drizzle ORM (SQLite option for single-server deployments)
- **Frontend:** React + Vite + Tailwind + shadcn/ui
- **Agent Layer:** LLM integration (OpenAI / Anthropic) with tool-use for infrastructure actions
- **Infrastructure APIs:** Docker Engine API (unix socket), SSH for remote hosts
- **Formatting:** Biome
- **Validation:** Zod

## Repository Setup

- Create the project at `~/github/homelab-manager`
- Initialize with `bun init`
- Dual git remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through the full product:

- **Core agent loop:** Natural language input → intent classification → action planning → execution (with approval gates for destructive actions) → result reporting
- **Docker management:** List, start, stop, restart, update (pull new image + recreate), logs, health status, resource usage
- **System management:** OS updates (apt/dnf), disk usage, memory/CPU monitoring, service status
- **Health checks:** Configurable HTTP/TCP/Docker health checks with alerting
- **Backup orchestration:** Trigger and verify backups for Docker volumes and databases
- **SSL/DNS:** Certificate renewal tracking (Let's Encrypt), DNS record management (Cloudflare API)
- **Approval system:** Risk-scored actions — low risk (view, check) auto-execute, medium risk (restart, update) require approval, high risk (delete, config change) require explicit confirmation
- **Dashboard:** Real-time infrastructure overview, action history, agent chat interface
- **Authentication:** Single-user or household auth (not multi-tenant for v1)
- **Notifications:** Webhook, email, or push notifications for alerts and approval requests

### 2. Create BUILD.md

Create `BUILD.md` in the project root as the living build tracker:

```markdown
# Homelab Manager — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Architecture Decisions
[Document key decisions as you make them]

## Phase Plan

### Phase 1: [Name]
**Goal:** [what this phase delivers]
**Status:** In Progress

#### Deliverables
- [ ] Item 1
- [ ] Item 2
...

#### Phase 1 Prompt
> [Self-contained prompt for a fresh agent session. Full context, architecture references, acceptance criteria.]

---

### Phase 2: [Name]
...

[Continue for all phases to MVP]

---

### Future Phases (Post-MVP)
- [ ] Feature ideas
```

Each phase prompt must be **fully self-contained** — an agent with no prior context can read it and know exactly what to build, where files are, and what "done" looks like.

### 3. Scaffold the Project

- Bun + TypeScript project init
- Biome config
- Drizzle ORM setup
- Directory structure based on architecture
- Dev scripts in `package.json`
- README.md with project description, setup instructions, architecture overview
- Docker Compose for local development (Postgres + the app)
- Initial commit and push

### 4. Execute Phase 1

Work through Phase 1 deliverables. Update BUILD.md as items complete.

## Key Design Principles

### Agent Architecture
- **Tool-based execution:** The LLM doesn't generate shell commands directly. It calls typed tools (e.g., `docker.restart(containerId)`, `system.update()`) with validated parameters. Tools execute the actual operations.
- **Approval gates:** Every tool has a risk level. Low = auto-execute. Medium = execute with notification. High = block until approved. Risk levels are configurable per-user.
- **Audit trail:** Every action (proposed, approved, executed, failed) is logged with timestamp, trigger (user request vs. automated), and result.
- **Conversational context:** The agent maintains context about your infrastructure — container names, common issues, past actions. It should say "your Postgres container has been restarting every few hours, want me to check the logs?" not treat every interaction as a blank slate.

### Infrastructure Integration
- Docker Engine API over unix socket (not shelling out to `docker` CLI)
- SSH via native TypeScript library for remote host management
- Health checks run on configurable intervals, stored in Postgres
- Alert thresholds configurable per-service

### Dashboard
- Real-time container status grid (running, stopped, unhealthy, updating)
- Resource usage graphs (CPU, memory, disk, network)
- Action history feed
- Chat interface for natural language commands
- Mobile-responsive — you'll check this from your phone

### Security
- No default credentials. Setup wizard generates auth on first run.
- All Docker API calls validated and scoped — no raw command passthrough.
- Secrets (API keys, SSH keys) encrypted at rest in the database.
- Network exposure: binds to localhost by default, user opts into external access.

## Quality Bar

- Tests for every tool/action (Docker mock for CI)
- TypeScript strict, no `any`
- Structured logging with levels
- Database migrations via Drizzle Kit
- Docker Compose for one-command dev setup
- README reflects actual setup steps at all times

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report what you built when done.
