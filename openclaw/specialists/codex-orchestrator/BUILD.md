# BUILD.md

Status: blocked — the old `courier-of-the-weird` first-playable tracker is stale because that repo is not currently present under the live `~/github` tree. Do not launch a new lane against it until the repo is restored locally and the prompt plus acceptance checks are rewritten around the real checkout.

## Phase plan
- [x] Preserve the prior toolchain snapshot (`dotnet`, Godot mono app, Blender app) for reference
- [x] Confirm the older repo-specific path assumptions are now stale
- [ ] Decide whether to restore `courier-of-the-weird` locally or retire this lane
- [ ] If restored, rewrite the lane prompt and repo-specific checks against the real checkout
- [ ] Only then launch a new tracked Codex lane

## Active target repo
- [ ] none currently — previous target `courier-of-the-weird` is absent locally

## Acceptance checks / validation commands
- `test -d /Users/sawyer/github && ls -1 /Users/sawyer/github`
- `dotnet --version`
- `/Applications/Godot_mono.app/Contents/MacOS/Godot --version`
- `/Applications/Blender.app/Contents/MacOS/Blender --version | head -n1`
- repo-specific `git status --short --branch` only after the target checkout exists locally

## Verification snapshot
- `.NET SDK` available: `10.0.103`
- Godot app binary available at `/Applications/Godot_mono.app/Contents/MacOS/Godot` reporting `4.6.1.stable.mono.official.14d19694e`
- Blender app binary available at `/Applications/Blender.app/Contents/MacOS/Blender` reporting `Blender 5.0.1`
- `courier-of-the-weird` is not present in the current `/Users/sawyer/github` inventory as of 2026-03-09; treat the older path-specific notes as historical only

## Immediate next-pass priorities
- Reconcile this tracker with a real local target repo
- Either restore `courier-of-the-weird` or replace it with the correct current project before launching Codex
- Keep path-specific commands out of the tracker until the repo exists locally

## Blockers / pending decisions
- Missing local checkout for the previously targeted repo
- `godot` and `blender` are still not on PATH, so commands should use the discovered app binaries directly unless PATH is updated later
