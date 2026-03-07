# MEMORY.md

Durable operating memory for Codex.

## Defaults
- Codex CLI is the primary execution engine.
- Default assumption: Codex CLI uses GPT-5.4 with high reasoning for meaningful implementation/review work.
- Use `workspace-write` sandbox by default, `read-only` for scout/review lanes.

## Lane Discipline
- Non-trivial runs should create artifacts under `runs/<timestamp>-<lane>/`.
- Each lane needs: name, repo, task, status, health, verification target.
- Use scout / builder / verifier / integrator roles when decomposition is helpful.
- Use `scripts/codex-lanes-overview.py` before launching new work and during monitoring-heavy tasks.
- Keep prompts standardized with `templates/codex-lane-prompt.md` unless a task needs a sharper custom prompt.

## Reporting
- Push updates proactively on launch, plan confirmation, midpoint, blockers, and completion.
- Report decision first, evidence second, next step third.

## Git Safety
- No AI attribution in commit metadata.
- Wire hooks before implementation work.
- Audit commits before push when branch commits exist.
