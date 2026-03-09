# Coordination

Shared coordination surface for Codex-orchestrator.

## Default pattern

For any real swarm, delegated PM, or tracked multi-lane pass:

1. Create or reuse a project state file (`STATE.yaml`)
2. Register it in `PROJECT_REGISTRY.yaml`
3. Have every worker read/write the same `STATE.yaml`
4. Keep the main session thin: framing, priority, verification, user updates

## Files

- `PROJECT_REGISTRY.yaml` — active project registry for reusable PMs / tracked projects
- `runs/batches/<timestamp>-<slug>/STATE.yaml` — default per-project state file created by `scripts/codex-batch.py init`

## Helper commands

```bash
python3 scripts/codex-state.py registry-list
python3 scripts/codex-state.py summary runs/batches/<timestamp>-<slug>/STATE.yaml
```
