# scry-home — Build Tracker

**Status:** 2026-03-11 control-plane safety hardening verified locally; remotes, backup verification, sync failure handling, and OpenClaw audit drift are reconciled in the working tree
**Last Updated:** 2026-03-11
**Latest Relevant Commit:** current `HEAD` — working tree ahead with remote-policy hardening, backup verification contract fixes, and new regression tests

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
- `uv run pytest`
- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run python -m scripts bootstrap`
- `uv run python -m scripts doctor`
- `uv run python -m scripts sync:remotes`
- `uv run python -m scripts openclaw:audit`
- `uv run python -m scripts projects:doctor`
- `uv run python -m py_compile scripts/cli.py scripts/projects_config.py scripts/remote_policy.py scripts/tasks/bootstrap.py scripts/tasks/doctor.py scripts/tasks/harden_specialists.py scripts/tasks/projects.py scripts/tasks/sync_remotes.py scripts/tasks/setup_workstation.py scripts/tasks/sync_openclaw.py scripts/tasks/verify_config_backup.py scripts/tasks/sync_work_desktop.py scripts/tasks/audit_openclaw_docs.py`

---

## Verification Snapshot

- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run ruff check .` ✅
- `uv run pytest` ✅ 8 regression tests cover remote policy safety, sync-openclaw commit gating, metadata-driven backup verification, work-desktop accounting, and audit path classification
- `uv run ruff check scripts/tasks/sync_openclaw.py scripts/tasks/audit_openclaw_docs.py` ✅
- `UV_CACHE_DIR=/tmp/uv-cache-scry-home uv run python -m scripts bootstrap` ✅ prerequisite check passed; local repo env synced; managed project installs now remain explicit
- `uv run python -m scripts doctor` ✅ toolchain/core-file check passed; managed-project inventory still reports missing local clones for `boring-go-web`, `c-from-the-ground-up`, and `hello-world-from-hell`
- `uv run python -m scripts sync:remotes` ✅ managed mirror repos clean; contribution clone `openclaw` is preserved as a custom upstream+fork topology instead of being flagged as an error
- `uv run python -m scripts projects:doctor` ✅ managed-project inventory ran; same three local clones are absent
- `uv run python -m py_compile scripts/cli.py scripts/projects_config.py scripts/remote_policy.py scripts/tasks/bootstrap.py scripts/tasks/doctor.py scripts/tasks/harden_specialists.py scripts/tasks/projects.py scripts/tasks/sync_remotes.py scripts/tasks/setup_workstation.py scripts/tasks/sync_openclaw.py scripts/tasks/verify_config_backup.py scripts/tasks/sync_work_desktop.py scripts/tasks/audit_openclaw_docs.py` ✅
- `uv run python -m scripts sync:openclaw` ✅ mirrored `openclaw/memory/2026-03-11.md` and refreshed `openclaw/cron-jobs.json` from the live workspace
- `uv run python -m scripts openclaw:audit` ✅ workspace docs, mirrors, and path references are consistent; missing `/Applications/Blender...` probe is now reported as a warning instead of a hard failure
- `uv run python -m scripts cab:new --project=scry-home --packet=review-check --dry-run` ✅
- Note: earlier 2026-03-09 sandboxed verification used `UV_CACHE_DIR=/tmp/uv-cache-scry-home`; the current 2026-03-11 local pass ran directly with the normal local `uv` environment.
- `openclaw/cron-jobs.json` was refreshed from the live workspace and committed; the latest 2026-03-11 encrypted backup artifact + metadata remain local-only because the rotated archive exceeds GitHub's 100 MB file limit, while the verification logic itself is now metadata-driven so default and scheduled scopes validate consistently.

---

## Immediate Next Pass Priorities

1. Decide whether the remaining single-origin personal repos (`boring-go-web`, `c-from-the-ground-up`, `podwatch`, `pyforge`, `questlog`) should be promoted to the managed dual-mirror policy or intentionally left as manual/single-host clones.
2. Decide whether rotating encrypted backup blobs should remain in normal git history or move to a dedicated backup target while `scry-home` keeps the manifest/control-plane role.
3. Revisit managed-project inventory scope separately if Stephen wants the keeper set narrowed or renamed.

---

## Blockers / Human Decisions

- Root `SOUL.md` and `AGENTS.md` are sync-governed copies, so future stack-policy edits must still originate in the canonical OpenClaw workspace to persist.
- The encrypted backup artifact is large and changes frequently; the current 2026-03-11 archive exceeds GitHub's 100 MB push limit, so future publication needs either a dedicated blob target or a different repo/storage strategy instead of normal git history.
