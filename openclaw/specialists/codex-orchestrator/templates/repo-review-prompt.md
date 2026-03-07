# Repo Review Prompt Template

For each target repo:

- Review the repository as it exists now.
- Determine what the project is, whether it is useful, and whether it should continue, pivot, archive, or be deleted.
- Be candid about whether the project feels redundant, overbuilt, stale, vague, or pointless — but ground every judgment in evidence from the repo.
- Suggest cleaner, more literal, more memorable repository names.
- Write the final review to `/Users/sawyer/.openclaw/workspace/reviews/<repo>.md`.

Required sections:
1. Repo
2. What it is
3. Current state
4. Code / architecture review
5. Keep / pivot / archive / delete recommendation
6. Why it may be worth keeping
7. Why it may be dumb / redundant / not worth continued attention
8. Rename ideas
9. Immediate next step

Review expectations:
- Read the local README/docs/code first.
- Inspect project structure, config, dependency choices, test state, and maintenance signals.
- If commands are run, prefer the lightest useful checks.
- Do not make code changes unless absolutely needed to produce the review.
- Overwrite the target review file with complete Markdown.
