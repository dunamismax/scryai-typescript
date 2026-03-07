# TOOLS.md - Local Notes

## Projects

- All active repos: `~/github/<name>` (see MEMORY.md for full list)
- OpenClaw workspace (canonical): `~/.openclaw/workspace`
- Scry config repo: `~/github/grimoire`
- Sync script: `~/github/grimoire/scripts/tasks/sync_openclaw.py`

## OpenClaw Install

- **Git-based install**: `~/openclaw` (main branch, v2026.3.3+)
- **Runtime symlink**: `~/.openclaw/lib/node_modules/openclaw` → `~/openclaw`
- **Binary**: `~/.local/bin/openclaw` → `~/openclaw/openclaw.mjs`
- **Update method**: `cd ~/openclaw && git pull` then restart gateway
- **Service**: LaunchAgent (`ai.openclaw.gateway.plist`), port 18789

## Mobile Workbench

### Fast Intake
- Inspect: `package.json`, `app.json` / `app.config.*`, `eas.json`, `ios/`, `android/`, navigation/state/query/auth setup
- Determine: Expo managed vs prebuild vs bare, SDK version, build profiles, and verification scripts

### Core Commands
- **Dev server**: `npx expo start`, `npx expo start --clear`
- **Install Expo-compatible deps**: `npx expo install <pkg>`
- **Lint**: repo command first, else `npx eslint .`
- **Typecheck**: repo command first, else `npx tsc --noEmit`
- **Tests**: repo command first, else `npm test -- <path-or-suite>`
- **Expo health**: `npx expo-doctor`
- **Native run**: `npx expo run:ios`, `npx expo run:android`
- **Build/export**: `npx expo export`, `eas build --platform ios|android`

### Debugging Defaults
- Prefer smallest reproducible case before broad refactors.
- Capture platform, OS version, device/emulator, app version, build profile, and auth/network state.
- Distinguish JS/runtime issues from native/config/build issues early.
- Clear caches only when the symptoms fit.
- Re-test the original failing path and one adjacent regression path.

### Platform Notes
- **iOS**: safe areas, keyboard behavior, permission prompts, deep-link handling, gesture/back-swipe expectations
- **Android**: back behavior, permission nuances, nav/status bar appearance, intent/deep-link differences, OEM-specific quirks
- **Both**: auth/session restore, offline state, list performance, image sizing, accessibility, dark mode if supported

### Verification Notes
- Shared-flow changes should be checked on both iOS and Android when possible.
- Config/plugin/dependency changes usually need `expo-doctor` plus build/export validation.
- Expo Go validation is not equivalent to dev-build or production-binary validation.
- Never claim device/build verification that did not actually happen.

## Reference Docs

- **CONTRIBUTING_TO_OPENCLAW.md** (workspace + grimoire) — read before any work on the OpenClaw repo. Covers repo setup, build system, PR template, Signal plugin architecture, test patterns, reviewer expectations.
- **MOBILE-RUNBOOK.md** — Builder Mobile's practical React Native + Expo execution guide.

## SSH Remotes

All repos use dual SSH remotes with host aliases:
- GitHub: `github.com-dunamismax`
- Codeberg: `codeberg.org-dunamismax`
- Push: `git push --force origin main` (hits both)

## Signal

- Scry's number: `+19414416722`
- Stephen's number: `+19412897570`
- CLI: `/opt/homebrew/bin/signal-cli`

## Paired Nodes

- Stephen's MacBook Air (remote macOS node — use `nodes.run` for macOS-only tasks)

## Enabled Integrations (2026-03-03)

- **Browser**: Brave, profiles `openclaw` (port 18800) and `chrome` (port 18792)
- **ACP**: acpx backend, default agent codex, allowed: pi/claude/codex/opencode/gemini
- **Sub-agents**: depth 2, 8 concurrent, 5 concurrent children/agent, 2h archive
- **Web search**: Brave provider, API key configured, functional
- **Web fetch**: 50K chars, 30s timeout
- **Notion**: "Scry" integration → "Stephen's Notion" workspace (share pages to grant access)
- **Whisper**: Local speech-to-text (no API key, runs on Apple Silicon)

## Declined Integrations

- Email / Himalaya — declined by Stephen (2026-03-03)

## Installed CLIs

- `gh`, `docker`, `ffmpeg`, `yt-dlp`, `codex`, `claude`, `jq`, `tmux`, `summarize`, `whisper`, `clawhub` — all available
- **Not installed**: acpx, mcporter, playwright

## TTS

- Default voice: whatever's configured (no specific preference noted yet)
