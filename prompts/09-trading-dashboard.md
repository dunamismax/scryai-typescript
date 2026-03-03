# Open-Source AI Trading Dashboard — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **Augur Dashboard** — a self-hostable AI-powered trading dashboard with trade journaling, strategy analysis, and real-time market commentary. This extends the existing `augur` codebase at `~/github/augur` (Python trading system with IBKR integration and Claude analysis).

The goal is to add a polished web dashboard frontend and enhance the AI analysis layer. The Python backend stays Python — it's the right tool for trading (pandas, numpy, IBKR API). The frontend is TypeScript + React.

Target audience: self-directed traders who want AI-assisted analysis without sending their trading data to third-party platforms. The "AI that argues with your trade thesis" angle is the sticky hook.

## Tech Stack

### Backend (Existing — Python)
- **Language:** Python 3.12+
- **Trading:** IBKR API (ib_insync or ibapi)
- **Data:** pandas, numpy
- **AI:** Anthropic Claude API for trade analysis
- **Formatting:** Ruff

### Frontend (New — TypeScript)
- **Runtime:** Bun
- **Framework:** Vite + React Router
- **Styling:** Tailwind + shadcn/ui
- **Server State:** TanStack Query
- **Charts:** Lightweight Charts (TradingView) or Recharts
- **Formatting:** Biome
- **Validation:** Zod

### Shared
- **Database:** Postgres (shared between Python backend and TS frontend API)
- **ORM:** SQLAlchemy (Python) + Drizzle (TypeScript) — both targeting the same schema
- **API Layer:** Python FastAPI backend serves data, React frontend consumes it

## Repository

- Existing repo at `~/github/augur`
- Dual remotes already configured
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

First, **read the existing codebase** at `~/github/augur`. Understand what exists before planning what to add. Then think through:

- **Current state assessment:** What does augur do today? What's the data model? What analysis exists? What's the API surface?
- **Dashboard views:**
  - **Portfolio overview:** Current positions, P&L (daily, weekly, all-time), allocation breakdown
  - **Trade journal:** Log every trade with entry/exit, thesis, outcome, AI commentary. Searchable, filterable, taggable.
  - **AI analysis panel:** Real-time AI commentary on open positions. The AI maintains a running thesis and challenges your assumptions. "You're adding to a losing position in a sector showing weakness — what's your edge here?"
  - **Strategy backtesting:** Define simple strategies, run against historical data, visualize results
  - **Market dashboard:** Watchlists with real-time quotes, sector heatmaps, key indicators
  - **Performance analytics:** Win rate, profit factor, average hold time, best/worst trades, drawdown analysis
- **AI integration:**
  - Trade thesis review: before entering, describe your thesis and get AI analysis of risks and blind spots
  - Post-trade analysis: after closing, AI reviews what happened vs. your thesis
  - Pattern detection: AI identifies recurring patterns in your trading (e.g., "you tend to hold losers 3x longer than winners")
  - Morning briefing: daily summary of portfolio, market conditions, and positions that need attention
- **API layer:** FastAPI backend exposing data to React frontend. WebSocket for real-time updates.

### 2. Create BUILD.md

Create `BUILD.md` in the augur project root:

```markdown
# Augur Dashboard — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Existing Codebase Summary
[Document what you found in the current augur codebase]

## Architecture Decisions
[Key decisions — especially the Python/TypeScript boundary]

## Phase Plan

### Phase 1: [Name]
**Goal:** [deliverable]
**Status:** In Progress

#### Deliverables
- [ ] ...

#### Phase 1 Prompt
> [Self-contained prompt — MUST include context about existing codebase structure]

---

[All phases to MVP]

---

### Future Phases (Post-MVP)
- [ ] ...
```

**Critical for this project:** Phase prompts must include a summary of the existing codebase structure. A fresh agent won't have read the repo — give them the map.

### 3. Scaffold the Frontend

- Create `dashboard/` directory in the augur repo
- Bun + Vite + React Router + Tailwind + shadcn/ui
- TanStack Query setup pointing to FastAPI backend
- Biome config
- Chart library setup
- Dev scripts (run frontend + backend together)
- Update root README.md to cover the full project (backend + dashboard)

### 4. Execute Phase 1

Build Phase 1. Update BUILD.md.

## Key Design Principles

### The AI Layer
- **Opinionated, not sycophantic.** The AI should push back on weak theses. "Looks good!" is useless. "Your thesis assumes the Fed holds rates, but futures are pricing in a cut — how does that change your position?" is valuable.
- **Evidence-based.** AI commentary cites specific data: price levels, volume changes, sector correlations, historical analogs. Not vibes.
- **Adaptive.** Learns your trading style from your journal. Comments become more relevant over time.
- **Risk-aware.** Always surfaces portfolio-level risk: concentration, correlation, drawdown proximity, position sizing relative to account.

### Dashboard UX
- **Information density.** Traders want data, not whitespace. Dense but organized — think Bloomberg Terminal accessibility with modern design quality.
- **Real-time.** Positions and P&L update live. No manual refresh.
- **Keyboard-first.** Power users navigate with keyboard shortcuts. Mouse is optional for core workflows.
- **Dark mode default.** Traders stare at screens all day. Light mode available but dark is primary.

### Python/TypeScript Boundary
- Python backend owns: trading logic, IBKR connection, data processing, AI analysis, database writes.
- TypeScript frontend owns: rendering, client-side state, API consumption, real-time UI updates.
- API contract: OpenAPI spec generated from FastAPI, consumed by TanStack Query with typed endpoints.
- Both share Postgres. Migrations managed by Python (SQLAlchemy/Alembic) as source of truth. Drizzle schema mirrors it.

### Performance
- Dashboard loads in under 2 seconds with full portfolio.
- Charts render smoothly with thousands of data points.
- WebSocket updates at most 1/second for real-time data (no flooding).
- Historical data paginated and cached aggressively.

## Quality Bar

- Frontend: TypeScript strict, no `any`, component tests for key views
- Backend: Python type hints, Ruff formatting, test coverage for AI analysis prompts
- API: OpenAPI spec, response validation
- Database: Migrations tested, rollback scripts
- README: Full setup guide (Python env + Node/Bun + Postgres + IBKR)
- Demo mode: Dashboard works with mock data when IBKR isn't connected

## Go

Read the existing codebase first. Then: Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
