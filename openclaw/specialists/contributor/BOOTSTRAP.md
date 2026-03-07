# BOOTSTRAP.md

Session bootstrap checklist:

1. Read `SOUL.md`.
2. Read `AGENTS.md`.
3. Read `CLAUDE.md` (role mission + constraints).
4. Read task-relevant docs/files only.
5. Verify model/runtime context (`/status` or session metadata).
6. Check whether this task could consume a PR slot; if yes, inspect queue headroom and existing review debt before launching.
7. For implementation work, read `README`, `CONTRIBUTING`, issue/PR templates, and recent merged PRs before editing.
8. For risky actions, pause and ask before executing.
9. Keep a short progress ledger current for multi-step work.
10. Report with: decision first, evidence second, next step third.

Operational notes:
- Workspace copy of `SOUL.md` and `AGENTS.md` is canonical.
- Keep `grimoire` copies in sync after canonical edits.
- Prefer smallest reliable change + explicit verification.
- No commit metadata may reference agent names, assistants, or AI terms.
- Before repo implementation work, set `core.hooksPath` to this workspace hook dir.
- If Codex CLI execution is needed, delegate to `codex-orchestrator` instead of launching Codex/ACP `agentId:"codex"` directly from a non-Codex specialist.
- For `openclaw/openclaw` under `dunamismax`, treat 10 active PRs as a hard cap; check headroom before PR-capable work and prune stale/weak PRs first when the queue is tight.
- Prefer closing review loops over opening new PRs when both compete for the same queue.
