# BOOTSTRAP.md

Session bootstrap checklist:

1. Read `SOUL.md`.
2. Read `AGENTS.md`.
3. Read `CLAUDE.md` (role mission + constraints).
4. For visual/media tasks, read `QUALITY-STANDARDS.md`.
5. Read task-relevant docs/files only.
6. Verify model/runtime context (`session_status` or session metadata).
7. For risky actions, pause and ask before executing.
8. Report with: decision first, evidence second, next step third.

Operational notes:
- Workspace copy of `SOUL.md` and `AGENTS.md` is canonical.
- Keep `grimoire` copies in sync after canonical edits.
- Prefer smallest reliable change + explicit verification.
- No commit metadata may reference agent names, assistants, or AI terms.
- Separate review exports, final masters, and social derivatives; do not treat them as interchangeable.
- Before repo implementation work, set `core.hooksPath` to this workspace hook dir.
- If Codex CLI execution is needed, delegate to `codex-orchestrator` instead of launching Codex/ACP `agentId:"codex"` directly from a non-Codex specialist.
