# OpenClaw Workflow Packs / Marketplace — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **ClawPacks** (working name) — a collection of pre-built, installable agent workflow packs for OpenClaw, plus a marketplace storefront for discovering and distributing them. Each pack is a versioned, configurable OpenClaw skill that solves a specific automation need.

OpenClaw has the runtime but faces a cold-start problem — users install it and ask "now what?" Workflow packs answer that question instantly. This is also a platform play: building the marketplace early establishes authority in the ecosystem. ClaHub (clawhub.com) already exists as a discovery platform — this project creates high-quality packs for it and optionally a standalone marketplace frontend.

This project has two deliverables:
1. **The packs themselves** — 5-7 high-quality, production-ready OpenClaw skills
2. **The marketplace** — A web frontend for browsing, previewing, and installing packs

## Tech Stack

### Workflow Packs
- **Format:** OpenClaw skill format (SKILL.md + supporting scripts)
- **Scripts:** TypeScript + Bun (or shell scripts where simpler)
- **Configuration:** Zod schemas for pack settings

### Marketplace Frontend
- **Runtime:** Bun
- **Framework:** Vite + React Router (SPA)
- **Styling:** Tailwind + shadcn/ui
- **Database:** Postgres with Drizzle ORM (pack registry, analytics)
- **Auth:** Better Auth (GitHub OAuth)
- **Formatting:** Biome
- **Validation:** Zod

## Repository Setup

- Create at `~/github/clawpacks`
- `bun init`, dual remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through:

**Workflow Packs to Build:**

1. **Release Notes Generator** — Watches for new git tags or merged PRs. Generates structured release notes from commit messages, PR descriptions, and diff analysis. Posts to GitHub Releases, Slack/Discord, or a changelog file.

2. **Issue Triage Agent** — Monitors new GitHub issues. Auto-labels based on content analysis (bug, feature, question, duplicate). Assigns to team members based on expertise matching. Detects duplicates and links them. Adds initial response acknowledging the issue.

3. **Daily Digest** — Aggregates activity across configured sources (GitHub repos, RSS feeds, monitoring endpoints, calendars) into a structured morning briefing. Delivered via preferred channel (Signal, Telegram, email).

4. **Dependency Watchdog** — Scans repos on a schedule for outdated dependencies, security advisories, and deprecated packages. Opens PRs with updates, or sends alerts for breaking changes that need manual intervention.

5. **PR Review Reminder** — Tracks open PRs across repos. Sends reminders to reviewers based on configurable SLAs. Escalates stale PRs. Summarizes review backlog daily.

6. **Uptime Monitor** — HTTP/TCP health checks on configurable endpoints. Alert via webhook/Signal/Telegram when services go down. Track uptime history. Generate weekly reliability reports.

7. **Meeting Prep Agent** — Before calendar events, pulls relevant context: recent messages from attendees, open PRs/issues discussed previously, relevant docs. Sends a briefing 15 minutes before the meeting.

**Marketplace:**
- Pack listing with search and category filtering
- Pack detail pages: description, README rendering, configuration options, install instructions
- One-click install command generation (`openclaw skill install <pack>`)
- Version history per pack
- Download/install analytics
- User ratings and reviews (post-MVP)

### 2. Create BUILD.md

Create `BUILD.md`:

```markdown
# ClawPacks — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Architecture Decisions
[Key decisions]

## Phase Plan

### Phase 1: [Name]
**Goal:** [deliverable]
**Status:** In Progress

#### Deliverables
- [ ] ...

#### Phase 1 Prompt
> [Self-contained prompt]

---

[All phases to MVP]

---

### Future Phases (Post-MVP)
- [ ] ...
```

Phase prompts: **fully self-contained**.

### 3. Scaffold

- Monorepo structure: `packs/` (individual skill directories) + `marketplace/` (web frontend)
- Each pack: `SKILL.md`, scripts, config schema, README
- Marketplace: Bun + Vite + React Router + Tailwind
- Biome, Drizzle + Postgres (for marketplace)
- Dev scripts
- README.md
- Initial commit and push

### 4. Execute Phase 1

Build Phase 1. Update BUILD.md.

## Key Design Principles

### Pack Quality Standards
- Every pack must work out of the box with minimal configuration.
- SKILL.md follows OpenClaw skill format exactly.
- Configuration via environment variables or a config file, validated with Zod.
- Each pack includes: README with setup instructions, example outputs, troubleshooting guide.
- Packs should be independent — no inter-pack dependencies.
- Error handling: packs fail gracefully with clear error messages, never crash the host agent.

### OpenClaw Integration
- Study the OpenClaw skill format before building. Reference: https://docs.openclaw.ai and local docs at `~/.openclaw/lib/node_modules/openclaw/docs`.
- Skills use the tools available to OpenClaw agents (exec, web_search, web_fetch, message, cron, etc.).
- Packs that need scheduling should use OpenClaw's cron system.
- Packs should work across channels (Signal, Telegram, Discord) — don't hardcode channel-specific behavior.

### Marketplace Design
- Clean, fast, searchable. Developer audience — no marketing fluff.
- Pack pages render the README as the primary content.
- Install instructions are copy-pasteable.
- Show real usage metrics (installs, active users) once available.
- Mobile-responsive.

### Distribution
- Packs hosted in the repo, publishable to npm or ClaHub.
- Versioned with semver.
- Changelog per pack.

## Quality Bar

- Each pack tested manually with a real OpenClaw instance
- Marketplace: TypeScript strict, no `any`, Lighthouse 90+
- Database migrations via Drizzle Kit
- README for repo, README for each pack, README for marketplace
- All packs documented with example output and config reference

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
