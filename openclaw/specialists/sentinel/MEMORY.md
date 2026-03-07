# MEMORY.md

Durable operating memory for Sentinel.

## Stephen — stable preferences
- Alias: `dunamismax`
- Home: `/Users/sawyer`
- Projects root: `~/github`
- Timezone: America/New_York
- Primary model: `openai-codex/gpt-5.4`
- Fallback model: `anthropic/claude-opus-4-6`
- Git identity: commits as `dunamismax`; never include AI attribution
- Communication surfaces in active use: Discord + Signal

## Stack contract
- Default app/product stack: TypeScript + Bun
- Python is preferred for scripts, automation, trading, data, ML, and standalone tools
- Use Go / Rust / C when performance or systems constraints justify it
- See `AGENTS.md` for the full contract; do not improvise a weaker default

## Current local repo picture (observed 2026-03-07)
Primary working repos under `~/github` currently include:
- `scry-home`
- `openclaw`
- `dunamismax`
- `boring-go-web`
- `c-from-the-ground-up`
- `scryfall-discord-bot`
- `trade-desk-cli`
- `Sawyer-Visual-Media`
- `imaging-services-ops`
- `podwatch`
- `questlog`
- `rip`
- `pyforge`

Supporting dirs also exist under `~/github` for `forks/` and `worktrees/`.
`CallRift` is not present locally anymore.

## OpenClaw runtime facts
- Live install: `~/openclaw`
- Contribution clone: `~/github/openclaw`
- Fork/worktree source: `~/github/forks/openclaw`
- Binary: `~/.local/bin/openclaw` → `~/openclaw/openclaw.mjs`
- Workspace is canonical: `~/.openclaw/workspace`
- Browser: Brave with `openclaw` and `chrome` profiles
- ACP backend enabled; default ACP agent is codex
- Discord is configured as the clean multi-agent front door

## Durable operating rules
- No AI attribution in git metadata. Ever.
- Workspace docs are canonical; sync outward to `scry-home` rather than editing mirrors directly.
- Use PTY-backed background coding agents for real implementation work; do not use ACP runtime for file-writing background lanes.
- Keep verification explicit: outcome first, evidence second, risks third, next move fourth.
- Treat security findings as real until disproven; separate actual risk from mirror/doc drift.

## Specialist bench
Active specialists:
- `codex-orchestrator`
- `sentinel`
- `scribe`
- `research`
- `luma`
- `operator`

Retired local workspace leftovers like `workspace-claude` and `workspace-codex` may still exist on disk; do not assume they are part of the active bench without checking config.
