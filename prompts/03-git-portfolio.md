# Git-Powered Developer Portfolio — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **GitFolio** (working name) — a developer portfolio generator that builds a living, verifiable portfolio from actual git history. Agents analyze commits, languages, contribution patterns, code complexity, and project impact across repos to generate a portfolio that updates automatically as the developer ships code.

This is not another resume builder. It's proof-of-work for developers. The portfolio is linked to real commits, not self-reported skills. The viral hook: "I don't have a resume — I have a portfolio that updates every time I push code."

Target audience: developers who ship code and hate writing resumes. Secondary audience: recruiters who want verified signal over self-reported fluff.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Framework:** Vite + React Router (framework mode, SPA with SSR for portfolio pages — SEO matters here)
- **Styling:** Tailwind + shadcn/ui
- **Database:** Postgres with Drizzle ORM
- **APIs:** GitHub REST/GraphQL API, GitLab API, Codeberg/Gitea API
- **Agent Layer:** LLM for commit analysis, project description generation, skill extraction
- **Server State:** TanStack Query
- **Auth:** Better Auth (GitHub OAuth for connecting repos)
- **Formatting:** Biome
- **Validation:** Zod

## Repository Setup

- Create at `~/github/gitfolio`
- `bun init`, dual remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through:

- **Data pipeline:** Connect GitHub account → fetch repos + commits → analyze patterns → generate portfolio data → render pages
- **Analysis engine:** What signals matter? Commit frequency, language distribution, code churn, project lifespan, README quality, test presence, contribution to others' repos, PR review activity
- **AI layer:** LLM summarizes each project based on commit messages, file changes, and README. Extracts skills and technologies. Generates a narrative "about" section from the aggregate data.
- **Portfolio rendering:** Public-facing pages with SSR for SEO. Clean, fast, mobile-responsive. Shareable URL (`gitfolio.dev/username` or custom domain).
- **Update mechanism:** Webhook-triggered (GitHub push events) or cron-based re-analysis.
- **Privacy controls:** User chooses which repos are public in portfolio. Private repo analysis happens but results can be aggregated without exposing repo names.
- **Analytics:** Who viewed your portfolio, which projects they clicked, referral sources.
- **Comparison/benchmarking:** Optional — how your commit patterns compare to similar developers (anonymized).

### 2. Create BUILD.md

Create `BUILD.md` in the project root:

```markdown
# GitFolio — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Architecture Decisions
[Key decisions documented here]

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

Phase prompts must be **fully self-contained**. A fresh agent reads one prompt and knows everything: project context, architecture, file layout, current state, and acceptance criteria.

### 3. Scaffold the Project

- Bun + TypeScript + Vite + React Router setup
- Tailwind + shadcn/ui initialization
- Biome config
- Drizzle ORM + Postgres setup
- Better Auth with GitHub OAuth
- Directory structure per architecture plan
- Dev scripts
- README.md
- Initial commit and push

### 4. Execute Phase 1

Build Phase 1 deliverables. Update BUILD.md as you go.

## Key Design Principles

### Portfolio Pages
- **Profile overview:** Avatar, name, bio (auto-generated from git activity), top languages, contribution heatmap, total commits/PRs/repos
- **Project cards:** Each analyzed repo gets a card with AI-generated description, language breakdown, activity timeline, key metrics (stars, forks, commit count, last active)
- **Skill graph:** Visual representation of technologies used, weighted by actual commit volume (not self-reported)
- **Activity timeline:** When you shipped, what you shipped, how consistently
- **Verification badges:** Links to actual commits. "This developer wrote 47 commits in Rust in the last 6 months" → click → see the commits

### Analysis Pipeline
- Fetch commit history (paginated, handle large repos)
- Classify commits: feature, fix, refactor, docs, test, chore (from commit messages + diff analysis)
- Extract technologies from file extensions, package files, import statements
- Score project impact: commit frequency × code volume × project maturity × collaboration signals
- LLM generates human-readable project descriptions from raw data
- Cache analysis results — don't re-analyze unchanged repos

### Performance
- Portfolio pages must load fast. SSR for initial paint, hydrate for interactivity.
- Analysis runs async — don't block the user while crunching repos.
- Progressive rendering: show what's ready, update as analysis completes.

### Privacy
- Private repos never exposed by name in public portfolio
- User controls exactly what's visible
- Analysis data can be deleted on request (account deletion)
- No tracking scripts on portfolio pages (your analytics only, no third-party)

## Quality Bar

- Tests for analysis pipeline (mock git data)
- TypeScript strict, no `any`
- Lighthouse score 90+ on portfolio pages
- Mobile-first responsive design
- Database migrations via Drizzle Kit
- README with real setup steps and screenshots

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
