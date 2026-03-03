# GitHub Issue Triage Agent Prompt (OpenClaw)

Use this prompt in a fresh OpenClaw session to launch a background Codex/ACP agent for issue triage.

```text
Spin up a background coding agent for issue triage in this repo.

Repo:
- <ABSOLUTE_REPO_PATH>

Requirements:
- Run in background so the main thread remains responsive.
- Prioritize high-signal issues first (security, correctness, data-loss, reliability).
- For each triaged issue, output: severity, reproducibility, likely root cause area, and recommended action.

Workflow:
1) Pull current open issues (via gh CLI where available).
2) Group by severity + effort.
3) Propose a 1-week execution order.
4) For top 3 issues, create implementation-ready mini-briefs.
5) Update root BUILD.md with triage outcomes and next-pass priorities.

Verification:
- Validate any factual claims from code references.
- Do not invent issue details.

Output format:
- Executive summary
- Prioritized issue table
- Top 3 implementation briefs
- Exact BUILD.md updates made
```
