# Agentic Code Review GitHub App — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **DeepReview** (working name) — a GitHub App that performs deep, context-aware code review using AI agents. Unlike surface-level AI review tools, this one ingests your codebase's architecture, style conventions, past review comments, and documented decisions. It reviews PRs for architectural fit, naming consistency, test coverage gaps, and pattern divergence — not just syntax bugs.

Key differentiator: **self-hostable**. Enterprises and security-conscious teams that won't send code to third-party clouds can run it on their own infrastructure.

Multi-agent architecture: one agent per changed file, an orchestrator synthesizes findings into a coherent review.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Backend:** Bun server with Hono
- **Database:** Postgres with Drizzle ORM + pgvector extension (for codebase embeddings)
- **GitHub Integration:** GitHub App (webhooks + Octokit)
- **Vector Store:** pgvector for codebase context retrieval
- **LLM:** OpenAI / Anthropic API with tool-use
- **Frontend Dashboard:** React + Vite + Tailwind + shadcn/ui
- **Auth:** Better Auth (GitHub OAuth)
- **Formatting:** Biome
- **Validation:** Zod

## Repository Setup

- Create at `~/github/deep-review`
- `bun init`, dual remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through:

- **Review pipeline:** PR webhook → fetch diff → load codebase context from vector store → fan out agents per file → collect findings → orchestrator synthesizes → post review comments on PR
- **Codebase indexing:** On installation, crawl the repo and embed files into pgvector. Update incrementally on pushes. Store: file content, file path, imports/exports, function signatures, doc comments.
- **Context retrieval:** When reviewing a changed file, retrieve the most relevant context — files it imports from, files that import it, related tests, architectural docs (README, ARCHITECTURE.md, ADRs).
- **Review dimensions:** Bug detection, architectural consistency, naming conventions, test coverage (did they test the change?), complexity warnings, documentation gaps.
- **Multi-agent fanout:** One agent reviews each changed file in parallel with full context. Orchestrator deduplicates, resolves conflicts, and posts a unified review.
- **Learning:** Store past review comments and outcomes (accepted, dismissed, led to changes). Use this to calibrate future reviews — learn the team's actual standards, not generic rules.
- **Configuration:** Per-repo config file (`.deepreview.yml`) for custom rules, ignored paths, severity thresholds, review style preferences.
- **Self-hosting:** Docker image with all dependencies. Environment variables for LLM API keys and GitHub App credentials.

### 2. Create BUILD.md

Create `BUILD.md` in the project root:

```markdown
# DeepReview — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Architecture Decisions
[Document key decisions]

## Phase Plan

### Phase 1: [Name]
**Goal:** [deliverable]
**Status:** In Progress

#### Deliverables
- [ ] ...

#### Phase 1 Prompt
> [Self-contained prompt for fresh agent session]

---

### Phase 2: [Name]
...

[All phases to MVP]

---

### Future Phases (Post-MVP)
- [ ] ...
```

Phase prompts: **fully self-contained**. Fresh agent, one prompt, full context, clear acceptance criteria.

### 3. Scaffold the Project

- Bun + TypeScript project
- Hono server setup
- Biome config
- Drizzle ORM + Postgres + pgvector setup
- GitHub App boilerplate (webhook handler, Octokit client)
- Directory structure per architecture
- Docker Compose for dev (Postgres with pgvector extension)
- Dev scripts
- README.md
- Initial commit and push

### 4. Execute Phase 1

Build Phase 1 deliverables. Update BUILD.md as you go.

## Key Design Principles

### Review Quality
- **Contextual, not generic.** "This function doesn't follow the pattern used in the other 6 service files" is a good review comment. "Consider adding error handling" is not — every AI tool says that.
- **Specific line references.** Every comment points to an exact line with an exact concern. No vague "consider restructuring this module."
- **Severity levels:** Error (blocks merge), Warning (should address), Note (suggestion/style). Configurable thresholds for which levels appear.
- **Evidence-backed:** When flagging a pattern inconsistency, link to the file that demonstrates the expected pattern.

### Multi-Agent Architecture
- **File agents** operate in parallel. Each gets: the changed file diff, full file content, retrieved context files, repo conventions summary.
- **Orchestrator agent** receives all file agent findings. Deduplicates, resolves contradictions, groups related findings, generates the final review.
- **Cost awareness:** Track token usage per review. Provide cost estimates in dashboard. Allow budget limits per repo.

### Codebase Indexing
- Initial full crawl on app installation
- Incremental updates on push events (only re-embed changed files)
- Smart chunking: split by function/class, not arbitrary line counts
- Store metadata alongside embeddings: file path, language, last modified, imports, exports

### Self-Hosting
- Single Docker image, `docker run` with env vars
- Or Docker Compose with Postgres included
- No external dependencies except LLM API
- Health check endpoint
- Migration runner on startup

## Quality Bar

- Tests for review pipeline (mock GitHub webhooks, mock LLM responses)
- TypeScript strict, no `any`
- Structured logging
- Database migrations via Drizzle Kit
- Docker image builds and runs from scratch
- README with setup for both cloud and self-hosted

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
