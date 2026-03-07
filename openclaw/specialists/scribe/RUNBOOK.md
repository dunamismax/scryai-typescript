# RUNBOOK.md — Scribe Operations

## 1) Hook wiring check (target repo)
```bash
git -C <repo> config --get core.hooksPath
```
Expected:
`/Users/sawyer/.openclaw/workspace-scribe/hooks/git`

## 2) Manual attribution audit
```bash
/Users/sawyer/.openclaw/workspace-scribe/scripts/agent-attribution-audit.sh <repo> origin/main
```

## 3) Weekly scored smoke
```bash
/Users/sawyer/.openclaw/workspace-scribe/scripts/specialist-weekly-smoke.sh
```

## 4) Canonical workspace doc audit
```bash
cd /Users/sawyer/github/scry-home && uv run python -m scripts openclaw:audit
```

Scored categories:
- Protocol quality (0-10)
- Verification discipline (0-10)
- Attribution compliance (0-10)

PASS threshold: each category >= 8.
