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
- Communication surfaces in active use: Discord primary; Signal currently disabled in live config but still available locally if re-enabled

## Stack contract
- Default app/product stack: TypeScript + Bun
- Python is preferred for scripts, automation, trading, data, ML, and standalone tools
- Use Go / Rust / C when performance or systems constraints justify it
- See `AGENTS.md` for the full contract; do not improvise a weaker default

## Current local repo picture (observed 2026-03-09)
Primary local repos under `~/github` currently include:
- `Sawyer-Visual-Media`
- `changeledger`
- `dunamismax`
- `imaging-services-ops`
- `openclaw`
- `rip`
- `scry-home`
- `scryfall-discord-bot`

## OpenClaw runtime facts
- Live runtime package install: `~/.openclaw/lib/node_modules/openclaw`
- Contribution clone and current worktree source: `~/github/openclaw`
- No separate standalone OpenClaw dev/install checkout is currently present locally outside `~/github/openclaw`
- CLI wrapper: `~/.local/bin/openclaw` → `~/.openclaw/lib/node_modules/openclaw/openclaw.mjs`
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
