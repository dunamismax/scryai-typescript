# scry-home — Build Tracker

**Status:** 2026-03-09 OpenClaw mirror/audit cleanup verified and committed locally; push optional
**Last Updated:** 2026-03-09
**Latest Relevant Commit:** current `HEAD` — `Checkpoint OpenClaw audit cleanup state`

---

## What This Repo Is

`scry-home` is Stephen's personal control plane for Scry and local OpenClaw operations.

- Versioned export of canonical OpenClaw workspace docs
- Backup and restore automation for critical local state
- Workstation bootstrap and tracked config snapshots
- Small repo-management and audit CLI tasks

The live OpenClaw workspace is canonical. The local `openclaw/` tree is a mirror and should not be hand-edited.

---

## Phase Plan

### Phase 1 — Inventory and migration plan

- [x] Read repo control docs and current implementation before editing
- [x] Inventory repo-owned Bun/Biome/TypeScript references and obsolete manifests
- [x] Record a truthful Python-only migration plan in this tracker

### Phase 2 — Repo-owned tooling realignment

- [x] Remove root Bun/Biome manifests and lockfiles that are no longer part of the implementation
- [x] Update repo bootstrap, doctor, and managed-project metadata to use Python-native checks for `scry-home`
- [x] Replace repo lint/verification guidance with `uv` + Ruff commands
- [x] Keep mirrored `openclaw/` files untouched

### Phase 3 — Docs and helper cleanup

- [x] Rewrite repo-owned docs to describe a Python-first ops repo without Bun/Biome defaults
- [x] Remove or trim stale review/helper material that still prescribes the old JS stack for this repo
- [x] Update generated specialist hardening templates so future synced policy output no longer reintroduces Bun defaults

### Phase 4 — Verification and checkpoint

- [x] Run Ruff across the repo-owned Python surface
- [x] Run the repo doctor and managed-project doctor
- [x] Syntax-check the modified Python entrypoints/modules
- [x] Reconcile this tracker with the final state
- [x] Create a local commit if the checkpoint verifies cleanly

---

## Acceptance Checks

- `uv run ruff check .`
- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run python -m scripts bootstrap`
- `uv run python -m scripts doctor`
- `uv run python -m scripts projects:doctor`
- `uv run python -m py_compile scripts/cli.py scripts/projects_config.py scripts/tasks/bootstrap.py scripts/tasks/doctor.py scripts/tasks/harden_specialists.py scripts/tasks/projects.py`

---

## Verification Snapshot

- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run ruff check .` ✅
- `uv run ruff check scripts/tasks/sync_openclaw.py scripts/tasks/audit_openclaw_docs.py` ✅
- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run python -m scripts bootstrap` ✅ prerequisite check passed; local repo env synced; managed project installs now remain explicit
- `uv run python -m scripts doctor` ✅ toolchain/core-file check passed; managed-project inventory still reports missing local clones for `boring-go-web`, `c-from-the-ground-up`, and `hello-world-from-hell`
- `uv run python -m scripts projects:doctor` ✅ managed-project inventory ran; same three local clones are absent
- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run python -m py_compile scripts/cli.py scripts/projects_config.py scripts/tasks/bootstrap.py scripts/tasks/doctor.py scripts/tasks/harden_specialists.py scripts/tasks/projects.py` ✅
- `uv run python -m py_compile scripts/tasks/sync_openclaw.py scripts/tasks/audit_openclaw_docs.py` ✅
- `uv run python -m scripts openclaw:audit` ✅ workspace docs, mirrors, and path references consistent after the 2026-03-09 cleanup
- Note: `uv` cache writes to `~/.cache/uv` are blocked by this sandbox, so cache-backed checks were rerun with `UV_CACHE_DIR=/tmp/uv-cache-scry-home`
- `openclaw/cron-jobs.json`, `vault/config/critical-configs.meta.json`, and `vault/config/critical-configs.tar.enc` now reflect the latest successful 2026-03-09 scheduled runs / encrypted backup checkpoint, and that state has been captured in the current local checkpoint commit.

---

## Immediate Next Pass Priorities

1. Reconcile the cron tracked-repo inventory with the actual `~/github` tree so daily/weekly summaries stop naming missing repos as if they were still active.
2. Decide whether rotating encrypted backup blobs should remain in normal git history or move to a dedicated backup target while `scry-home` keeps the manifest/control-plane role.
3. Revisit managed-project inventory scope separately if Stephen wants the keeper set narrowed or renamed.

---

## Blockers / Human Decisions

- Root `SOUL.md` and `AGENTS.md` are sync-governed copies, so future stack-policy edits must still originate in the canonical OpenClaw workspace to persist.
- The encrypted backup artifact is large and changes frequently; keeping it in normal git history is workable for now but still carries churn/storage tradeoffs.
