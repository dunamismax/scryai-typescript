# Build Prompts

> Bootstrap prompts for each project in `PROJECT_IDEAS.md`.
> Paste any prompt into a fresh OpenClaw/Claude Code session to kick off a build.

## How It Works

Each prompt is self-contained and instructs the agent to:

1. **Scope** — Analyze the project requirements and define boundaries.
2. **Plan** — Create a `BUILD.md` in the project root with phased build plan and per-phase prompts.
3. **Scaffold** — Set up the repo, install dependencies, create the project structure.
4. **Execute Phase 1** — Build the core foundation defined in the plan.

Subsequent phases are continued by pasting the phase-specific prompt from `BUILD.md` into a new session.

## Prompts

| File | Project | Tier |
|---|---|---|
| `01-pr-firefighter.md` | PR Firefighter | 1 |
| `02-homelab-manager.md` | Self-Hostable AI Homelab Manager | 1 |
| `03-git-portfolio.md` | Git-Powered Developer Portfolio | 1 |
| `04-code-review-app.md` | Agentic Code Review GitHub App | 1 |
| `05-support-agent.md` | Self-Hosted Support Agent | 2 |
| `06-lead-to-quote.md` | Lead-to-Quote SMS Agent | 2 |
| `07-clip-engine.md` | Creator Clip Engine | 2 |
| `08-workflow-packs.md` | OpenClaw Workflow Packs / Marketplace | 2 |
| `09-trading-dashboard.md` | Open-Source AI Trading Dashboard | 2 |
