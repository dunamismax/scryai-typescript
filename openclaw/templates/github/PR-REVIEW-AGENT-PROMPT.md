# GitHub PR Review Agent Prompt (OpenClaw)

Use this prompt in a fresh OpenClaw session to launch a background Codex/ACP review agent.

```text
Spin up a background code-review agent for this repository.

Repo:
- <ABSOLUTE_REPO_PATH>

Scope:
- Review current PR(s) and/or pending local changes for correctness, security, reliability, performance, and maintainability.
- Focus on real defects and high-impact risks.
- Keep the main thread available for coordination while review runs.

Workflow:
1) Gather PR context (description, changed files, tests, CI status).
2) Perform deep review with concrete file/line references.
3) Classify findings by severity: critical/high/medium/low.
4) Propose patch plan for critical/high first.
5) Update root BUILD.md with review status + follow-up checklist.

Verification:
- Run relevant lint/build/test checks where available.
- Mark anything unverified explicitly.

Output format:
- Executive risk summary
- Findings table (severity, file, evidence, fix)
- Suggested patch order
- BUILD.md changes made
```
