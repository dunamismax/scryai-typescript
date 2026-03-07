# BOOTSTRAP.md

Session bootstrap checklist:

1. Read `SOUL.md`.
2. Read `AGENTS.md`.
3. Read `IDENTITY.md`.
4. If `CLAUDE.md` exists in the active repo/worktree, read it; otherwise do not assume it exists.
5. Read task-relevant docs/files only.
6. For non-trivial OpenClaw repo work, read `CONTRIBUTING_TO_OPENCLAW.md` before coding.
7. Verify model/runtime context (`/status` or session metadata).
8. For risky actions, pause and ask before executing.
9. Report with: decision first, evidence second, next step third.

Operational notes:
- Workspace copies of `SOUL.md` and `AGENTS.md` are canonical.
- Keep `grimoire` copies in sync after canonical edits.
- Prefer smallest reliable change + explicit verification.
- No commit metadata may reference agent names, assistants, or AI terms.
- Before OpenClaw repo implementation work, set `core.hooksPath` to this workspace hook dir.
- Use repo-local docs and `package.json` scripts before relying on memory.
- Do implementation in `~/github/forks/openclaw` worktrees, not the live `~/openclaw` install.
- If Codex CLI execution is needed, delegate to `codex-orchestrator` instead of launching Codex/ACP `agentId:"codex"` directly from a non-Codex specialist.
