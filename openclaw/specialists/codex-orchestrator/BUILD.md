# BUILD.md

## Task
Orchestrate a targeted Codex CLI swarm for repo consolidation, rename analysis, and migration work across Stephen's GitHub folder.

## User Constraints
- Use real local Codex CLI sessions from macOS shell
- Use `zsh`
- Use PTY
- Prefer `--full-auto`
- Use broader access only when the task truly spans multiple repos and needs it
- Do **not** rename any local repo directories
- Do **not** rename GitHub/Codeberg remotes
- Stephen will rename local dirs/remotes later

## Requested lanes
1. `images-migration`
   - Find repos that reference assets from `images`
   - Copy/move needed assets into the consuming repos
   - Rewrite references so `images` can be deleted later
   - Write final report in `REPO_REVIEWS/FINAL_REVIEWS`
2. `grimoire-review`
   - Re-review `grimoire` with correct context: backup/home for Scry/OpenClaw identity and ops
   - Inspect OpenClaw config/files for deeper context
   - Produce final review + rename ideas
3. `dotfiles-into-grimoire`
   - Incorporate `dotfiles` into `grimoire` as subfolder/backup flow input
   - Leave original repo dir untouched for now
   - Produce final report
4. `scripts-review`
   - Second-pass review of `scripts` as the likely master Python repo
   - Produce final review + naming/scope ideas
5. `oracle-rename-review`
   - Investigate old naming/history
   - Target rename direction: `scryfall-discord-bot`
   - Produce final review + rename plan
6. `imagingservices-consolidation`
   - Fold `imaging-services-website` into `imagingservices`
   - Position `imagingservices` as the single company/job repo
   - Produce final report

## Settled rename decisions from Stephen
- `sentinel` -> `repo-radar`
- `augur` -> `trade-desk-cli`
- `go-web-server` -> `boring-go-web`
- `imagingservices` -> `imaging-services-ops`
- `oracle` -> `scryfall-discord-bot`

## Planned deletions after work completes
- `homepage`
- `images` (after migration work)
- `sentinel`
- `xray-chrome`

## Deliverables
- New folder: `/Users/sawyer/github/REPO_REVIEWS/FINAL_REVIEWS`
- One final markdown report per lane
- Launcher + monitor scripts with a ledger under `runs/`

## Notes
- Cross-repo migration lanes may require broader access than a single-repo `--full-auto` run.
- Old repo-review swarm is complete and superseded by this targeted swarm.
