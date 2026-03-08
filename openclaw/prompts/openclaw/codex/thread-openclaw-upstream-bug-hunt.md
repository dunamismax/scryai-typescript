You are Codex in a fresh Discord thread under `#codex`, running a conservative upstream bug-hunt pass specifically for the **OpenClaw** repo.

Goal:
Find the **single best OpenClaw bug to fix next** if the priority is:
- real user-facing pain or clearly valid engineering pain
- small-to-medium scope
- high confidence the bug is real and still current on `main`
- fast verification
- high chance of clean review and merge upstream

This is **not** a “find the coolest issue” pass.
This is a **“find the best mergeable bug win for OpenClaw right now”** pass.

Fill these in before running:
- Focus window: [recent issues / PRs / timeframe / subsystem emphasis]
- Constraints: [timebox, no-go areas, headroom constraints, review sensitivity]
- PR appetite: [how aggressive or conservative to be]
- Explicit de-priorities: [areas to avoid unless overwhelmingly strong]

## OpenClaw-specific repo rules

- Use the upstream contribution clone at `~/github/openclaw`.
- **Never** do issue implementation from the live runtime checkout at `~/openclaw`.
- This pass is **scout-only**. Do **not** implement the fix in this thread.
- Do **not** open a PR from this thread.
- Check whether the likely winner is already being worked in an open PR or clearly claimed in issue comments.
- Treat active PR queue pressure as real. If the queue is tight, prefer bugs that are easy to land and easy to review.
- Prefer bugs with nearby tests and a narrow acceptance surface.

## Mission

1. Sync `~/github/openclaw` to the latest upstream `main`.
2. Review the best recent evidence sources for mergeable bug wins in OpenClaw:
   - recent open issues
   - recent PR review comments
   - recently merged PR fallout / regressions
   - failing or flaky test areas when clearly relevant
   - active subsystem hotspots where maintainers are already asking for follow-up
3. Identify the **one** best candidate bug to fix next.
4. Prove why it should win over flashier or larger alternatives.
5. Produce a full scout report plus a **paste-ready implementation prompt** for a separate Codex instance that will implement the fix, verify it, push a branch, and open the PR.

## Operating rules

- Scout only. Do **not** implement the fix.
- Choose **exactly one** winner.
- Do **not** pick broad refactors, platform migrations, architecture cleanups, or “quality” projects disguised as bugs.
- Avoid giant multi-system failures unless the fix surface is unexpectedly narrow and reviewable.
- Strongly avoid:
  - stale low-signal issues
  - bugs that require product decisions first
  - vague “might be broken” reports with no current evidence
  - fixes likely to sprawl across many subsystems
  - bugs that are already clearly in-flight in an open PR unless the path to a clean split/cherry-pick is obvious
- Prefer:
  - confirmed or strongly evidenced bugs
  - recent regressions
  - user-visible breakage
  - review comments that identify missing/faulty behavior
  - narrow runtime/config/tooling bugs with obvious proof paths
  - issues with nearby tests or obvious test homes
  - bugs whose fixed state can be shown with a small verification set

## OpenClaw-specific selection rubric

Choose the winner based on, in this order:
1. mergeability upstream
2. confidence the bug is real and still current on `main`
3. scope containment
4. user or maintainer value
5. ease of verification
6. low regression risk
7. low odds of turning into a hidden rewrite

If a bug is higher impact but messy, ambiguous, or likely to sprawl, it should usually lose to a smaller, cleaner fix with faster proof.

## Where to look first in OpenClaw

Bias toward likely wins in areas like:
- gateway / webchat / control-ui event routing
- session routing and session lifecycle
- command dispatch / auth / allowlist logic
- model or config resolution bugs
- tool schema / tool behavior mismatches
- messaging edge cases
- onboarding / configuration bugs
- narrow regressions with existing tests nearby

## Required output

Return a report with these exact sections:

# Top Mergeable OpenClaw Bug Recommendation

## 1) Recommended bug
- title
- issue / PR link(s) if any
- one-sentence summary
- why this is the best fast mergeable OpenClaw win

## 2) Why this should win
Explain specifically why this bug beats larger, flashier, or more urgent-looking candidates **for OpenClaw upstream right now**.

## 3) Top other candidates considered
List 3-5 other candidates.
For each:
- short title
- why it matters
- why it lost to the winner

## 4) Evidence
- exact issues / PRs / comments inspected
- exact files inspected
- exact tests / CI / signal sources reviewed
- only concrete observations

## 5) Current behavior
Describe the bug as it exists now.

## 6) Expected behavior
Describe the correct behavior.

## 7) Reproduction or proof
If directly reproducible:
- exact repro steps
- observed result
- expected result

If not directly reproducible:
- explicitly say that
- provide the strongest code / test / review / maintainer evidence that the bug is still real

## 8) Why this looks mergeable
Cover:
- likely scope size
- likely number of files touched
- whether tests likely already exist nearby
- whether acceptance criteria are clear
- why this should be a clean review in OpenClaw

## 9) Suspected root cause
- likely files / functions / modules
- why they are implicated

## 10) Likely fix surface
List the probable implementation files and probable test files.

## 11) Acceptance criteria
Write a concrete checklist that would prove the bug is fixed.

## 12) Suggested verification
List the smallest meaningful checks/tests to run after implementation.

## 13) Paste-ready implementation + PR prompt
Write a clean prompt for a **new Codex instance** that:
- assumes zero prior context
- is explicitly for the OpenClaw repo
- says exactly what bug to fix
- tells it to work from `~/github/openclaw`, not `~/openclaw`
- tells it to create a dedicated worktree / branch
- names the key files/tests to inspect
- includes acceptance criteria
- includes verification expectations
- tells it to implement and verify, not just analyze
- tells it to push a branch and open a focused upstream PR
- keeps scope tight and merge-oriented
- warns it not to bundle unrelated fixes

## 14) Proposed PR shape
- suggested branch name
- suggested PR title
- whether the PR should close an issue directly
- 2-4 bullet PR body outline

## Decision standard

You must choose **exactly one** winner.
Do **not** say “here are several good options.”
Do **not** optimize for novelty.
Optimize for the bug most likely to turn into a real merged OpenClaw fix soon, with the least drama.

## Final instruction

Be conservative, practical, and ruthless about scope.
Pick the bug you would personally hand to a fresh implementation agent if your only goal was:

**“land a real OpenClaw fix upstream with the least drama and the highest confidence.”**
