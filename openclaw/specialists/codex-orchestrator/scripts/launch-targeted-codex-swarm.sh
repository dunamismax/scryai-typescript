#!/bin/zsh
set -euo pipefail

ROOT=/Users/sawyer/github
OUT=$ROOT/REPO_REVIEWS/FINAL_REVIEWS
TS=$(date +%Y%m%d-%H%M%S)
RUNROOT=/Users/sawyer/.openclaw/workspace-codex-orchestrator/runs/${TS}-targeted-codex-swarm
LEDGER=$RUNROOT/ledger.tsv
mkdir -p "$OUT" "$RUNROOT"

print -r -- $'task\tpid\tmode\tworkdir\toutput_file\tlog_file\tprompt_file\tstatus' > "$LEDGER"

launch_task() {
  local task="$1"
  local mode="$2"
  local workdir="$3"
  local output_file="$4"
  local lane_dir="$RUNROOT/$task"
  local prompt_file="$lane_dir/prompt.md"
  local log_file="$lane_dir/stdout.log"
  mkdir -p "$lane_dir"

  cat > "$prompt_file"

  rm -f "$output_file"

  script -q /dev/null zsh -lc "cd '$workdir' && codex exec $mode --ephemeral -o '$output_file' -c features.command_attribution=false -c model_reasoning_effort=high -c model_reasoning_summary=concise \"\$(cat '$prompt_file')\"" > "$log_file" 2>&1 < /dev/null &
  local pid=$!
  print -r -- "$task"$'\t'"$pid"$'\t'"$mode"$'\t'"$workdir"$'\t'"$output_file"$'\t'"$log_file"$'\t'"$prompt_file"$'\t'running >> "$LEDGER"
}

launch_task images-migration --yolo /Users/sawyer/github/images /Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/images-migration-and-deletion-readiness.md <<'EOF'
You are handling a multi-repo asset consolidation task.

Goal: make it possible to delete the `/Users/sawyer/github/images` repo safely later.

Working set:
- Source repo: `/Users/sawyer/github/images`
- Candidate consumer repos: the immediate child git repos under `/Users/sawyer/github`
- Output report: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/images-migration-and-deletion-readiness.md`

Tasks:
1. Scan the other repos under `/Users/sawyer/github` for README/docs/markdown/HTML files that reference assets from the `images` repo.
   - Check GitHub raw/blob links, Codeberg raw/blob links, and any other obvious references to that repo.
2. Build an inventory of which assets are still actually referenced.
3. For each actively referenced asset, copy it into the most appropriate consuming repo so that repo becomes self-contained.
   - Prefer an existing images/assets/public/docs-media folder if one exists.
   - Otherwise create a small, sensible local asset folder.
4. Rewrite the referencing files in the consuming repo to use the new local path.
5. Do not do unnecessary churn. If an asset looks stale/unneeded, note it in the report instead of copying it blindly.
6. Do not rename any repo directories. Do not delete the `images` repo. Do not touch remotes.
7. Do not commit.

Report requirements:
- repos/files that referenced `images`
- assets copied and where they were placed
- links rewritten
- stale/unreferenced assets worth ignoring
- whether the `images` repo is now safe to delete, and any blockers still remaining
EOF

launch_task grimoire-review --full-auto /Users/sawyer/github/grimoire /Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/grimoire-final-review-and-renaming.md <<'EOF'
You are doing a second-pass high-context review of the `grimoire` repo.

Important context from Stephen:
- `grimoire` is his most important repo.
- It is effectively the backup/home for his Scry AI + OpenClaw identity, ops, automation, and supporting materials.
- He hates the name and wants better rename options.

Working set:
- Primary repo: `/Users/sawyer/github/grimoire`
- Also inspect nearby OpenClaw/config context as needed, including local OpenClaw docs/config/workspace files if they materially help you understand what `grimoire` is for.
- Output report: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/grimoire-final-review-and-renaming.md`

Tasks:
1. Re-review the repo with the above purpose in mind.
2. Inspect the repo structure, automation, docs, backup flows, and Scry/OpenClaw relationship.
3. Read relevant OpenClaw config/files around the local environment as needed to ground the review.
4. Produce a deeper judgment about what the repo really is, what should live there, what should not, and how it should evolve.
5. Generate strong replacement names — literal, operational, memorable, and brand-aligned variants.
6. Do not rename directories or remotes.
7. Do not commit.

Report requirements:
- what the repo actually is
- what should remain inside it
- what should be split/moved elsewhere
- architecture/ops review
- rename candidates, ranked
- your recommended final name
- immediate next steps
EOF

launch_task dotfiles-into-grimoire --yolo /Users/sawyer/github/grimoire /Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/dotfiles-into-grimoire-migration.md <<'EOF'
You are handling a repo consolidation task.

Goal: incorporate the contents/purpose of `/Users/sawyer/github/dotfiles` into `/Users/sawyer/github/grimoire` so `dotfiles` no longer needs to stand alone later.

Constraints from Stephen:
- Do not rename any repo directories.
- Leave the original `dotfiles` repo directory in place for now.
- Stephen will handle repo/directory deletion later.

Tasks:
1. Inspect `/Users/sawyer/github/dotfiles` and `/Users/sawyer/github/grimoire`.
2. Determine the best destination location inside `grimoire` for the dotfiles/config-backup material.
3. Copy/incorporate the relevant `dotfiles` content into `grimoire` in a clean, understandable structure.
4. Update the relevant docs/scripts inside `grimoire` so the imported material becomes part of the grimoire backup/config story.
5. Avoid destructive edits to the original `dotfiles` repo.
6. Do not rename directories or remotes.
7. Do not commit.

Output report: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/dotfiles-into-grimoire-migration.md`

Report requirements:
- destination structure chosen inside grimoire
- files/docs/scripts changed
- what from dotfiles was incorporated
- what still needs manual follow-up before the standalone `dotfiles` repo can be deleted
EOF

launch_task scripts-review --full-auto /Users/sawyer/github/scripts /Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/scripts-second-pass-review.md <<'EOF'
You are doing a second-pass high-context review of the `scripts` repo.

Important context from Stephen:
- He wants this to become his master Python repo where he does all of his Python work.
- He thinks it needs a much better name.
- He is open to expanding its scope or merging other Python-y things into it.

Tasks:
1. Re-review `/Users/sawyer/github/scripts` with that context in mind.
2. Judge whether it should become the main Python repo, and if so what its scope should be.
3. Suggest better names, structure, and merge boundaries.
4. Identify what should stay narrow vs what could be absorbed.
5. Do not rename directories or remotes.
6. Do not commit.

Output report: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/scripts-second-pass-review.md`

Report requirements:
- what the repo is now
- what it should become
- rename candidates, ranked
- what other work/repo types could belong here
- risks of making it too broad
- recommended final direction
EOF

launch_task oracle-rename-review --full-auto /Users/sawyer/github/oracle /Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/scryfall-discord-bot-rename-review.md <<'EOF'
You are doing a rename-oriented second-pass review of the `oracle` repo.

Important context from Stephen:
- He hates the current name `oracle`.
- He wants the direction to be `scryfall-discord-bot`.
- He thinks the repo used to be named something else and wants that history clarified.
- He will rename the local directory and remote repos later himself.

Tasks:
1. Inspect `/Users/sawyer/github/oracle`.
2. Check local git history and repo files to determine prior naming/identity if possible.
3. Re-review the repo with the new intended naming direction in mind.
4. Treat `scryfall-discord-bot` as the target naming direction unless history strongly suggests a better variant.
5. Do not rename the repo directory or remotes.
6. Do not commit.

Output report: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/scryfall-discord-bot-rename-review.md`

Report requirements:
- previous/older naming evidence found
- what the repo actually is
- whether `scryfall-discord-bot` is the right final name
- any better variants if they exist
- internal rename checklist for docs/package/module naming
- immediate next steps before Stephen renames the repo locally/remotely
EOF

launch_task imagingservices-consolidation --yolo /Users/sawyer/github/imagingservices /Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/imaging-services-consolidation.md <<'EOF'
You are handling a company-repo consolidation task.

Goal: fold `/Users/sawyer/github/imaging-services-website` into `/Users/sawyer/github/imagingservices` so the company/job material can live in one main repo later.

Important context from Stephen:
- `imagingservices` is the main/only repo he wants for company/job material.
- The future rename direction is `imaging-services-ops`.
- He will rename the repo directory/remotes later.

Constraints:
- Do not rename any local repo directories.
- Do not delete the old `imaging-services-website` repo directory.
- Do not touch remotes.
- Do not commit.

Tasks:
1. Inspect both repos.
2. Decide on the cleanest place inside `imagingservices` for the website code/content.
3. Copy or merge the relevant website repo contents into `imagingservices` in a clean, understandable way.
4. Update docs in `imagingservices` so it is clearly the single main repo for company/job material going forward.
5. Preserve useful history/context in documentation even though the repo dirs themselves are not being renamed/deleted yet.

Output report: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS/imaging-services-consolidation.md`

Report requirements:
- structure chosen inside imagingservices
- website content/code moved or copied
- docs updated
- what remains to do before the old standalone website repo can be deleted
- how the future `imaging-services-ops` rename should be reflected internally
EOF

print -r -- "$RUNROOT" > /Users/sawyer/.openclaw/workspace-codex-orchestrator/runs/latest-targeted-codex-swarm.txt
print -r -- "Launched 6 targeted Codex sessions."
print -r -- "Run root: $RUNROOT"
print -r -- "Ledger: $LEDGER"
