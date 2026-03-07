# BUILD.md

Status: `~/github` inspected, dirty repos verified, stale Codex runs terminated, and the one behind repo fast-forwarded.

## Phase plan
- [x] Inventory all git repos under `~/github`
- [x] Identify repos with local changes or sync issues
- [x] Inspect `podwatch` changes for completeness and correctness
- [x] Inspect `questlog` changes for completeness and correctness
- [x] Check whether any Codex/agent processes are still running for those repos
- [x] Run relevant verification in each dirty repo
- [x] Commit and push only the repos that pass verification or have explicitly scoped residual risk
- [x] Summarize final repo state across `~/github`

## Acceptance checks / validation commands
- `git status --short`
- `git rev-list --left-right --count HEAD...@{u}`
- `git fetch --all --prune --quiet`
- `uv run --with-requirements requirements.txt python manage.py check`
- `uv run --with-requirements requirements.txt python manage.py test`
- `uv run --with-requirements requirements.txt python -m compileall ...`
- `git pull --ff-only origin main` (for clean-behind repos when safe)

## Verification snapshot
- Repo inventory after fetch: 15 repos under `~/github`.
- `podwatch`: clean, synced, HEAD `b2681c8 rewrite podwatch as a Django app`.
  - checks passed
  - tests passed (4/4)
  - compileall passed
- `questlog`: clean, synced, HEAD `715577e rewrite questlog as a Django app`.
  - checks passed
  - tests passed (4/4)
  - compileall passed
- Stale live Codex processes for both rewrites were terminated after verifying the repos were already clean and synced.
- `openclaw`: was behind `origin/main`; fast-forwarded safely to `e20f44509` and is now clean/synced.
- All other repos in `~/github`: clean and synced with upstream tracking branches.

## Immediate next-pass priorities
1. Optional deeper code review of the Django rewrites if Stephen wants quality beyond green checks.
2. Optional cleanup of ignored/local leftovers inside rewritten repos if they become distracting.

## Blockers / pending decisions
- None.
