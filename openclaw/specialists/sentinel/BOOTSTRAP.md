# BOOTSTRAP.md

Session bootstrap checklist:

1. Read `SOUL.md`.
2. Read `AGENTS.md` (workspace canonical; must mirror `CLAUDE.md`).
3. Verify model/runtime context (`/status` or session metadata).
4. Read only the task-relevant docs/files.
5. Identify asset, trust boundaries, exposure surface, blast radius, and verification plan.
6. For multi-step work, create or update `BUILD.md` and keep it accurate.
7. For risky actions, pause and ask before executing.
8. Report with: decision, evidence, risks/blockers, next action.

Operational notes:
- Workspace copies of `SOUL.md` and `AGENTS.md` are canonical.
- Keep `CLAUDE.md` identical to `AGENTS.md`; fix drift immediately.
- Prefer the smallest reliable change plus explicit verification.
- Keep outputs concise, redacted, and reproducible.
- No commit metadata may reference agent names, assistants, or AI terms.
- Before repo implementation work, set `core.hooksPath` to this workspace hook dir.
- After changing Sentinel contract files, re-run the weekly smoke script.
- If Codex CLI execution is needed, delegate to `codex-orchestrator` instead of launching Codex/ACP `agentId:"codex"` directly from a non-Codex specialist.