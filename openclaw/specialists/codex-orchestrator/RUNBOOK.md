# RUNBOOK.md — Codex Orchestration

## Excellent orchestration means

- the split is clean,
- the lanes are scoped to real independence,
- monitoring is concise and evidence-based,
- failures are recovered quickly,
- Stephen gets one clear operational picture instead of chatter.

## Lane selection

Use **one lane** when scope is narrow or strongly sequential.

Use **2–3 lanes** when work separates naturally into:
- scout + builder
- backend + frontend
- builder + verifier

Add an **integrator lane** only when multiple builders can conflict.

Do not create extra lanes without a concrete reason.

## Launch checklist

Before launching a lane:
1. Confirm the repo path.
2. Confirm the task boundary.
3. Define verification.
4. Decide whether `exec` or PTY is actually needed.
5. Prefer tracked launch artifacts under `runs/`.

## Monitoring cadence

- **Fresh run (<3m quiet):** do not poke it.
- **3–10m quiet:** inspect logs once.
- **>10m quiet with weak signal:** treat as suspect.
- **>30m with no meaningful progress:** treat as stale and recover.

Aggregate lane status into one update unless there is a blocker.

## Recovery protocol

### Lane is quiet but likely healthy
- Read the latest log.
- Do not spam steering messages.
- Wait for the next meaningful signal.

### Lane is stuck or stale
- Check latest output and error lines.
- Decide whether the issue is:
  - prompt ambiguity,
  - repo/environment failure,
  - sandbox/tooling issue,
  - model drift / wrong plan.
- Recover with one targeted intervention:
  - steer the PTY lane, or
  - relaunch a narrower exec lane.

### Lane failed
- Preserve the artifact directory.
- Extract the failure cause.
- Retry once with a tighter prompt if the cause is recoverable.
- After two failures on the same scoped task, escalate or re-split.

### Parallel lanes conflict
- Stop launching more work.
- Decide authority: integrator or manual merge.
- Re-verify the combined result before reporting completion.

## Update discipline

Good update:
- one message,
- all active lanes summarized,
- blockers called out plainly,
- next milestone explicit.

Bad update:
- narrating every check,
- repeating healthy idle state,
- reporting without evidence,
- saying “done” before verification.

## Swarm manifests

For multi-lane work, create a batch first and attach lanes to it.

```bash
python3 scripts/codex-batch.py init <batch-name> --objective "<goal>"
export CODEX_BATCH_DIR=/Users/sawyer/.openclaw/workspace-codex-orchestrator/runs/batches/<timestamp>-<batch>
python3 scripts/codex-batch.py status "$CODEX_BATCH_DIR"
```

## PTY monitoring helper

For interactive Codex lanes, register the PTY lane and append health snapshots after `/status` checks.

```bash
python3 scripts/codex-pty-lane.py register <lane-name> <repo-dir> <session-id>
python3 scripts/codex-pty-lane.py snapshot runs/<timestamp>-<lane> --tokens 42000 --context healthy --note "implementing"
python3 scripts/codex-pty-lane.py status runs/<timestamp>-<lane>
```

## Watchdog

Use the watchdog when you want a stale/failed-only view.

```bash
python3 scripts/codex-watchdog.py --alerts-only
```

## Quick commands

```bash
python3 scripts/codex-lanes-overview.py
python3 scripts/codex-lane-status.py runs/<timestamp>-<lane>
python3 scripts/codex-batch.py status runs/batches/<timestamp>-<batch>
python3 scripts/codex-watchdog.py --alerts-only
./scripts/specialist-weekly-smoke.sh
```
