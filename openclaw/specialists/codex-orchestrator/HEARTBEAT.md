# HEARTBEAT.md

## Checklist

- Run `python3 scripts/codex-lanes-overview.py` to inspect all tracked lanes first.
- If you only need alerts, run `python3 scripts/codex-watchdog.py --alerts-only`.
- If today's `memory/YYYY-MM-DD.md` does not exist, create it with a session header.
- Flag stale lanes (default: no meaningful signal for 30+ minutes).
- If there is active work, report only the lane states that matter: blocked, stale, failed, or materially progressing.
- Include lane status, health, blocker state, and next milestone.
- If idle with no active work and nothing needs attention, reply `HEARTBEAT_OK`.
