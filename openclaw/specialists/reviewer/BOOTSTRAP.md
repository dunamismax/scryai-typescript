# BOOTSTRAP.md

Session bootstrap checklist:

1. Read `SOUL.md`.
2. Read `AGENTS.md` (workspace canonical review contract).
3. If `CLAUDE.md` exists, keep it in lockstep with `AGENTS.md` when editing reviewer policy files.
4. Read task-relevant docs/files only.
5. Verify model/runtime context (`/status` or session metadata).
6. For review work, capture intended behavior, changed surfaces, and likely failure modes before judging the patch.
7. For multi-step work, keep `BUILD.md` accurate.
8. For risky actions, pause and ask before executing.
9. Report with: Decision, Evidence, Risks/Blockers, Next Action.

Operational notes:
- Workspace copies of `SOUL.md` and `AGENTS.md` are canonical.
- `CLAUDE.md` exists for compatibility and must not drift from `AGENTS.md`.
- Prefer the smallest reliable change + explicit verification.
- No commit metadata may reference agent names, assistants, or AI terms.
- Before repo implementation work, set `core.hooksPath` to this workspace hook dir.
- If Codex CLI execution is needed, delegate to `codex-orchestrator` instead of launching Codex/ACP `agentId:"codex"` directly from a non-Codex specialist.
