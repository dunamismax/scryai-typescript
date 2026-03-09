# MEMORY.md - Long-Term Memory

> Curated durable facts, preferences, and project state.
> Only loaded in the main private session. Updated as things change.
> Daily context goes in `memory/YYYY-MM-DD.md`. This file is for things that outlive a day.

---

## Stephen - Preferences & Patterns

- Alias: `dunamismax`
- Home: `/Users/sawyer`
- Projects root: `~/github`
- Timezone: America/New_York
- Primary model: `openai-codex/gpt-5.4` · thinking: high · fallback: `anthropic/claude-opus-4-6`
- Git identity: commits as `dunamismax`. No AI attribution ever — no "Scry", "Co-Authored-By", or agent fingerprints
- Dual remotes: GitHub (`github.com-dunamismax`) + Codeberg (`codeberg.org-dunamismax`), force-push to main
- Machine: M5 MacBook Pro 14" (32GB/1TB, macOS 26.3.1)
- Communication channels: Discord primary; Signal currently disabled in live config but retained as a local integration option
- App stack: Notion, GitHub, Codeberg, Docker, VSCode, M365, macOS, Ghostty, RustDesk, Tailscale, Signal, Brave, LocalSend
- Email integration: declined (no Himalaya/Gmail/M365 access)

## Active Repos

`~/github` is the live local project root, but the checked-out inventory changes over time; trust the current tree over older summaries.

**Current local inventory (2026-03-09):**
- `Sawyer-Visual-Media`
- `changeledger`
- `dunamismax`
- `imaging-services-ops`
- `openclaw`
- `rip`
- `scry-home`
- `scryfall-discord-bot`

**Known repo roles / notes:**
- `scry-home` — Scry identity/config repo, CLI tools, sync scripts (renamed from `grimoire`)
- `openclaw` — primary local upstream/contribution clone
- `scryfall-discord-bot` — Discord MTG card lookup bot (renamed from `oracle`)
- `imaging-services-ops` — consolidated imaging-services repo/workflow (renamed from `imagingservices`)
- `rip` — video download tool
- `Sawyer-Visual-Media` — drone photography/videography business; DJI Mini 5 Pro
- `dunamismax` — GitHub profile README
- `changeledger` — local repo present under `~/github`; role not yet recorded here

**OpenClaw local layout:**
- `~/github/openclaw` — primary local repo clone and current contribution/worktree source
- `~/.openclaw/lib/node_modules/openclaw` — live runtime package install root
- No separate standalone OpenClaw dev/install checkout is currently present locally outside `~/github/openclaw`

## OpenClaw Setup

- **Install**: live runtime is a local-prefix package install at `~/.openclaw/lib/node_modules/openclaw` (updated to 2026.3.7 on 2026-03-08). CLI wrapper: `~/.local/bin/openclaw` → `~/.openclaw/lib/node_modules/openclaw/openclaw.mjs`. `~/github/openclaw` is the primary local repo clone; there is no separate standalone OpenClaw dev/install checkout at the moment.
- **Service**: LaunchAgent, port 18789, loopback-only + Tailscale auth allowance
- **Auth**: `openai-codex:default` (OAuth), `anthropic:default` (OAuth)
- **Signal**: currently disabled in live channel config; CLI/account details are still available locally if re-enabled later
- **Discord**: primary active chat surface; Stephen DM allowlist active; guild `1479614326774956167` allowlisted with per-agent channels bound to `main/codex-orchestrator/scribe/research/sentinel/luma/operator`; Discord thread bindings enabled for `/focus`, subagent thread spawns, and ACP thread spawns
- **Browser**: Brave, profiles `openclaw` (18800) + `chrome` (18792)
- **ACP**: acpx backend, default **codex**, allows pi/claude/codex/opencode/gemini, 8 concurrent
- **Sub-agents**: depth 2, 8 concurrent, 5 children/agent
- **Web**: Brave search + fetch (50K chars, 30s timeout)
- **Cron**: daily sync (3 AM), daily healthchecks, weekly bench smoke, daily briefing (8:35 AM)

### File Sync Model

Workspace is canonical → synced to `scry-home` root + `openclaw/` dir via `sync-openclaw` script. CLAUDE.md in other repos points to `scry-home`. Edit workspace, sync outward.

## Open-Source Contributions

- **PR #32217**: fix — Signal reaction messageId fallback + queued message channelId passthrough
- **PR #32397**: test — Numeric messageId coverage for Signal reaction handler
- **PR #32398**: docs — Recommended DM configuration for personal assistant use
- **PR #38156**: fix — Cron fallback watchdog stays independent from `payload.timeoutSeconds` for isolated cron agent turns (#37505)
- **Release milestone (2026-03-08)**: Stephen was credited as **1 of 196 contributors** in a new OpenClaw release announcement, with his actual GitHub avatar/profile photo visible in the contributor post.
- All authored as `dunamismax`. No Signal subsystem maintainer exists yet.

## Decisions (current-state only)

- No AI attribution in git. Ever. Global git hooksPath at `~/.openclaw/git-hooks` enforces this.
- Repos get CLAUDE.md pointing to `scry-home`, not their own SOUL/AGENTS files.
- PTY spawn is the only valid method for background coding agents. Never ACP runtime (`sessions_spawn runtime:"acp"`) — it silently fails on writes.
- TypeScript for apps/products. Python for all scripting/automation/utilities. Right tool wins.
- Model policy: capability over cost. GPT-5.4 primary (via Codex OAuth), Opus 4.6 fallback. No downgrades. Switched 2026-03-06 after PR #36590 merged.
- Specialist bench: 6 agents (codex-orchestrator, sentinel, scribe, research, luma, operator). Roster refactored 2026-03-07: retired reviewer/builder-mobile/openclaw-maintainer/contributor; added scribe (writing/comms), research (deep research/synthesis), operator (infra/automation/systems). Codex ⚡ dispatches Codex CLI (GPT-5.4) instances for parallel programming work.
- Workflow decision (2026-03-06): background Codex/GPT-5.4 coding work routes through `codex-orchestrator`; main and other specialists do not spawn Codex CLI or ACP `agentId:"codex"` directly for repo implementation. Repo specialists own framing; `codex-orchestrator` owns Codex execution, monitoring, and proactive status updates.
- OpenClaw upstream queue policy (2026-03-06): keep `dunamismax` at **<= 10 active PRs** in `openclaw/openclaw`. `codex-orchestrator` must prune stale/weak/superseded PRs before launching or opening more when the queue is tight.
- Codex-orchestrator prompt policy (2026-03-06): every spawned Codex CLI lane must be told to use local repo docs first for repo behavior, Context7 first for external/current docs and patterns, and web search only as fallback when Context7 lacks coverage or seems stale.
- `scry-home` CLI tools: `specialists:harden` (hook/template rollout), `cron:reconcile` (manifest convergence), `openclaw:audit` (workspace/mirror/path drift checks).
- `scry-home` workspace sync now mirrors specialist workspace docs under `scry-home/openclaw/specialists/<agentId>/` for bench backup coverage.
- Cron smoke reconciliation covers all six specialists: codex-orchestrator, sentinel, scribe, research, luma, operator.
- OpenClaw contribution guidance lives in the upstream repo at `~/github/openclaw/CONTRIBUTING.md`; extra local issue notes live under `~/github/scry-home/reference/` when present.
- Communication architecture (2026-03-06, updated 2026-03-08): Discord is the active multi-agent front door with one dedicated home channel per agent plus thread-bound session support. Signal is currently disabled in live config but remains available as a local integration option if re-enabled later.
- Workspace discipline (2026-03-07): canonical main-workspace docs now explicitly include `BOOTSTRAP.md`; multi-step maintenance passes should keep `BUILD.md` current until handoff.
- Reporting/memory discipline (2026-03-07): non-trivial work reports should lead with outcome → evidence → risks/open questions → next move; durable memory stores only stable preferences/decisions/facts, not transient task sludge.
- Doc drift automation (2026-03-07): `openclaw:audit` CLI command checks workspace doc completeness, mirror consistency, and stale path references. Daily cron job `healthcheck:workspace-doc-drift` runs at 3:40 AM. Daily bench check expanded to require USER.md, TOOLS.md, BOOTSTRAP.md across all agent workspaces.
- Sync/hardening improvements (2026-03-07, refined 2026-03-09): `sync_openclaw.py` now mirrors durable canonical/specialist markdown dynamically instead of a fixed hand-maintained list, while `openclaw:audit` ignores temporary specialist caches (`tmp/`, `runs/`, `reviews/`) and hidden cached skill docs so example paths do not create false positives. `harden_specialists.py` propagates USER.md, TOOLS.md, updated BOOTSTRAP template, and reporting/memory-hygiene rules into specialist workspaces.
- Specialist identity management (2026-03-07, late): `specialists:harden` now fully generates per-agent `IDENTITY.md` files from template data instead of appending only shared footer anchors; future bench identity polish should happen in `scripts/tasks/harden_specialists.py` and then be deployed with hardening.
- Repo rename (2026-03-07): the old `grimoire` repo is now `scry-home` at `~/github/scry-home`; current docs, cron jobs, and operational paths should use `scry-home`.
- Memory search fix (2026-03-07): local memory indexing now uses Ollama embeddings with `nomic-embed-text` plus a local placeholder API key (`ollama-local`). Codex OAuth does not satisfy memory embeddings.
- Discord trust posture (2026-03-07): the Discord deployment is a private single-user server for Stephen only. `openclaw status` may still emit a generic multi-user warning because the heuristic only sees allowlisted group targets.
- Discord architecture decision (2026-03-07, revised later that night): durable Discord organization now uses **one home channel per agent and task-specific threads underneath those home channels**. The old `Workspaces` category and its scoped channels were retired; OpenClaw Discord bindings/allowlists now target only the seven home channels, with thread bindings handling task branches.
- Prompt-storage decision (2026-03-07, revised later that night): reusable raw prompts live under `~/.openclaw/workspace/prompts/` and are mirrored into `scry-home/openclaw/prompts/`. The prompt pack is now organized **per agent** and written for **thread-first Discord use** rather than workspace-channel modes. Do not pursue a custom shared-skills rollout for this workflow right now.
- Prompt-library maintenance rule (2026-03-07, revised later that night): the canonical chooser lives in `workspace/prompts/openclaw/README.md`, the live Discord home-channel pin sources live in `workspace/prompts/openclaw/discord-pins/`, and `workspace/prompts/openclaw/DISCORD_PINNED_QUICKSTART.md` is now only the global overview. When the Discord home-channel model, prompt selection, or OpenClaw upstream flow changes, update the chooser plus the affected pin-source files, then re-sync/harden so the mirror and specialist prompt copies stay aligned.
- OpenClaw backup posture (2026-03-07): `scry-home` now carries an encrypted off-machine backup of high-value OpenClaw runtime state, not just docs/config. Current encrypted scope includes `.openclaw/agents`, `.openclaw/memory`, `.openclaw/subagents`, `.openclaw/cron`, and `.openclaw/delivery-queue` in addition to the prior critical-config set.
- Backup architecture note (2026-03-07): the current encrypted OpenClaw runtime artifact is large (~96 MB) and successfully pushes to private GitHub + Codeberg, but long-term the cleaner destination for rotating runtime blobs is a dedicated backup target (restic/B2/S3/NAS) rather than normal git history.
