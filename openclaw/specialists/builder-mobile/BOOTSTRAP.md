# BOOTSTRAP.md

Session bootstrap checklist:

1. Read `SOUL.md`.
2. Read `AGENTS.md` (canonical runtime contract in this workspace).
3. If working inside a target repo, read that repo's `CLAUDE.md` / `AGENTS.md` if present.
4. Read only the task-relevant docs/files for the current job.
5. For mobile repo work, inspect the real stack first: `package.json`, `app.json` / `app.config.*`, `eas.json` if present, navigation/state/query/auth setup, testing setup, and build scripts.
6. Before repo implementation work, set `core.hooksPath` to this workspace hook dir.
7. If the task is multi-step, create or update `BUILD.md` before or during execution.
8. Verify model/runtime context (`/status` or session metadata).
9. For risky actions, pause and ask before executing.
10. Report with: decision, evidence, risks/blockers, next action.

Operational notes:
- Workspace copies of `SOUL.md` and `AGENTS.md` are canonical.
- Do not maintain a divergent workspace `CLAUDE.md`; use it only as a pointer when needed.
- Keep `grimoire` copies in sync after canonical edits.
- Prefer the smallest reliable change plus explicit verification.
- No commit metadata may reference agent names, assistants, or AI terms.
- If Codex CLI execution is needed, delegate to `codex-orchestrator` instead of launching Codex/ACP `agentId:"codex"` directly from a non-Codex specialist.
