# PR Firefighter — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **PR Firefighter** — a DevTools SaaS product that autonomously fixes broken CI pipelines. When a GitHub Actions workflow fails, the agent clones the repo, reproduces the failure in a sandboxed environment, diagnoses the root cause, writes a fix with passing tests, and opens a PR with full evidence (reproduction steps, diff explanation, test output).

This is a real product intended for public release. Build it like you'd ship it — clean architecture, proper error handling, real tests. No placeholder "TODO" code that never gets filled in.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Framework:** GitHub App (Probot or raw webhooks)
- **Backend:** Bun server with Hono or similar lightweight router
- **Database:** Postgres with Drizzle ORM
- **Sandboxing:** Docker containers for repo cloning and test execution
- **LLM Integration:** OpenAI / Anthropic API for diagnosis and fix generation
- **Frontend Dashboard:** React + Vite + Tailwind + shadcn/ui
- **Formatting:** Biome (no ESLint/Prettier)
- **Validation:** Zod

## Repository Setup

- Create the project at `~/github/pr-firefighter`
- Initialize with `bun init`
- Set up dual git remotes:
  - `github.com-dunamismax` (GitHub)
  - `codeberg.org-dunamismax` (Codeberg)
- All commits authored as `dunamismax`. No AI attribution — no "Claude", "Co-Authored-By", or agent fingerprints anywhere in git history.

## Your First Task — Scope, Plan, and Scaffold

Before writing any application code, you must:

### 1. Scope the Project

Analyze the full requirements below and define clear boundaries for the MVP vs. future features. Think through:

- Core workflow: webhook receipt → failure analysis → repo clone → reproduction → fix generation → PR creation
- GitHub App registration and permissions model
- Sandboxed execution strategy (Docker container lifecycle)
- LLM prompting strategy for diagnosis and code generation
- Database schema for tracking jobs, repos, fixes, and outcomes
- Dashboard requirements for monitoring fix history
- Authentication and multi-tenancy
- Rate limiting and cost management (LLM API costs, GitHub API limits)

### 2. Create BUILD.md

Create `BUILD.md` in the project root. This is the living build tracker. Structure it as:

```markdown
# PR Firefighter — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Architecture Decisions
[Document key decisions as you make them]

## Phase Plan

### Phase 1: Foundation & Core Pipeline (current)
**Goal:** [what this phase delivers]
**Status:** In Progress

#### Deliverables
- [ ] Item 1
- [ ] Item 2
...

#### Phase 1 Prompt
> [Write a detailed, self-contained prompt that a fresh agent session can use to continue/complete Phase 1 work. Include full context needed.]

---

### Phase 2: [Name]
**Goal:** [what this phase delivers]
**Status:** Not Started

#### Deliverables
- [ ] Item 1
...

#### Phase 2 Prompt
> [Detailed prompt for a fresh session to execute Phase 2. Must include enough context that the agent doesn't need to read Phase 1's prompt.]

---

### Phase 3: [Name]
...

[Continue for all phases needed to reach a shippable MVP]

---

### Future Phases (Post-MVP)
- [ ] Feature idea 1
- [ ] Feature idea 2
...
```

**Critical:** Each phase prompt must be **fully self-contained**. An agent reading only that phase's prompt should understand the project, the current state, and exactly what to build. Include architecture context, file structure references, and acceptance criteria.

### 3. Scaffold the Project

After creating BUILD.md, scaffold the project:

- Initialize Bun project with TypeScript
- Set up Biome config
- Set up Drizzle ORM config (Postgres)
- Create the directory structure based on your architecture plan
- Set up basic dev scripts in `package.json`
- Create a README.md with project description, setup instructions, and architecture overview
- Initial commit and push

### 4. Execute Phase 1

Begin executing Phase 1 as defined in your BUILD.md. Work through the deliverables systematically. Update the checklist in BUILD.md as you complete items.

## Key Requirements

### GitHub App Behavior
- Listen for `check_suite.completed` and `workflow_run.completed` webhook events
- Filter for failures only
- Extract failure logs from GitHub Actions API
- Clone the repo at the failing commit
- Reproduce the failure in a Docker container
- Use LLM to diagnose root cause from logs and code context
- Generate a fix (code changes + new/modified tests)
- Verify the fix passes in the sandbox
- Open a PR with structured description: what broke, why, what this fixes, evidence

### Dashboard
- List of monitored repos
- Fix history with status (success/failure/pending)
- Cost tracking (LLM tokens, API calls)
- Configuration per repo (enabled/disabled, auto-merge threshold)

### Security
- Never expose API keys or tokens in logs
- Sandbox must be fully isolated — no network access during fix attempts (except to install deps)
- Validate all webhook payloads with GitHub signatures

## Quality Bar

- Every module has at least basic tests
- TypeScript strict mode, no `any` types
- All errors handled — no unhandled promise rejections
- Structured logging (not console.log)
- Database migrations managed by Drizzle Kit
- README stays current with actual setup steps

## Go

Begin now. Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report what you built when done.
