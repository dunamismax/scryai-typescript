# Handoff Prompts

> Copy-paste each prompt into a fresh coding agent session (Claude Code, Codex, etc.).
> Execute phases in order. Each is self-contained.
> After each phase, verify done criteria before moving to the next.

---

## Phase 4: Align CallRift (Mobile)

```
Read ~/github/scryai-typescript/SOUL.md first, then ~/github/scryai-typescript/AGENTS.md. These define identity and operational rules.

Your task: align the CallRift React Native app at ~/github/CallRift with our stack baseline.

Current state:
- React Native 0.76.9 + Expo SDK 52, React 18.3.1, TypeScript
- State management: zustand 5.0 (used for theme, preferences, SIP credentials, call state)
- Linting: expo lint (ESLint under the hood) — no Biome
- Navigation: expo-router 4.0 (file-based)
- Icons: lucide-react-native
- Secure storage: expo-secure-store
- Babel config present (babel.config.js)
- bun.lock exists, Bun is the package manager
- CLAUDE.md already present
- Dual SSH remotes (GitHub + Codeberg) already configured

Work to do:

1. Check the latest stable Expo SDK. If it supports React 19, upgrade Expo SDK + React together. If React 19 is not yet supported by the latest stable Expo SDK, document that and leave React at 18.3 — do NOT force an incompatible upgrade.

2. Replace expo lint / ESLint with Biome:
   - Remove all ESLint config files and deps
   - Add @biomejs/biome as a devDependency
   - Create biome.json: latest schema, indentStyle space, recommended rules, ignoreUnknown true, exclude node_modules/.expo/dist
   - Update package.json lint script to `bunx @biomejs/biome check .`

3. Evaluate zustand usage. It's currently used for client-side UI state (theme, preferences, SIP config, call state). This is appropriate for zustand — keep it. Only add TanStack Query if there's actual server/async data fetching that would benefit from caching and deduplication. Don't force the swap where zustand is the right tool.

4. Run `bun run lint` and `bun run typecheck`. Fix errors. Warnings are acceptable.

5. Update README.md tech stack table to reflect changes.

Constraints:
- Do NOT change app functionality or UI
- Commit as dunamismax. No AI attribution. No "Claude", "Scry", "Co-Authored-By", or AI references in commits, anywhere
- Force-push to main: `git push --force origin main` (hits both GitHub + Codeberg)
- Atomic, focused commits

Done when:
- `bun run lint` passes (warnings OK, zero errors)
- `bun run typecheck` passes
- Biome replaces ESLint entirely (zero ESLint config or deps remain)
- React is latest version compatible with current Expo SDK
- README reflects actual stack

After completing: update ~/github/scryai-typescript/REPO_ALIGNMENT.md Phase 4 checkboxes, commit and force-push scryai-typescript too.
```

---

## Phase 5: Rewrite scry-trader in TypeScript

```
Read ~/github/scryai-typescript/SOUL.md first, then ~/github/scryai-typescript/AGENTS.md.

Your task: rewrite scry-trader from Python to TypeScript + Bun.

Current state (~/github/scry-trader):
- Python trading system: Interactive Brokers (ib_async) + Anthropic Claude for analysis
- Modules:
  - broker.py — IBKR connection via ib_async (portfolio data, market data, order submission)
  - analyst.py — Claude analysis engine (Anthropic SDK with tool_use for structured output)
  - risk.py — hard risk rules (position limits, stop-loss requirements, daily loss circuit breakers)
  - journal.py — SQLite trade journal (trades, portfolio snapshots, analysis history)
  - models.py — Pydantic data models
  - config.py — config.toml loader
  - cli.py — Click CLI (commands: portfolio, watch, ask, analyze, buy, sell, risk, journal)
  - prompts/ — system prompts and tool definitions for Claude
- Files: src/scry_trader/, config.toml, data/, pyproject.toml, uv.lock, tests/, CLAUDE.md, README.md

Work to do:

1. Research TypeScript IBKR client options. Check @stoqey/ib and alternatives. If no mature TS client exists, implement a clean abstraction layer over IBKR's Client Portal API (REST/WebSocket).

2. Remove all Python files: pyproject.toml, uv.lock, src/scry_trader/, tests/.

3. Initialize TypeScript + Bun project with standard config (tsconfig strict, biome.json, package.json with scripts).

4. Reimplement all modules:
   - src/broker.ts — IBKR connection, portfolio, market data, orders
   - src/analyst.ts — Claude analysis (@anthropic-ai/sdk with tool_use)
   - src/risk.ts — ALL risk rules preserved exactly (position limits, stop-loss, circuit breakers)
   - src/journal.ts — SQLite journal (bun:sqlite)
   - src/models.ts — Zod schemas replacing Pydantic models
   - src/config.ts — config loading (.env + Zod, or keep config.toml with a TOML parser)
   - src/cli.ts — CLI entry point with same commands
   - src/prompts/ — system prompts and tool definitions

5. Verify: `bun run lint` and `bun run typecheck` pass.

6. Update README.md.

Constraints:
- Risk rules are critical and non-negotiable. Preserve every rule exactly.
- Commit as dunamismax. No AI attribution anywhere.
- Force-push to main.

Done when:
- Zero Python files remain
- All modules reimplemented in TypeScript
- Risk rules preserved exactly
- `bun run lint` passes
- `bun run typecheck` passes
- README updated
- `bun run src/cli.ts` works

After completing: update ~/github/scryai-typescript/REPO_ALIGNMENT.md Phase 5 checkbox.
```

---

## Phase 6: Bootstrap elchess in TypeScript

```
Read ~/github/scryai-typescript/SOUL.md first, then ~/github/scryai-typescript/AGENTS.md.

Your task: bootstrap elchess as a TypeScript web app.

Current state (~/github/elchess):
- README.md describing a self-hostable chess platform (inspired by Lichess)
- CLAUDE.md present
- No code. Originally planned as Elixir/Phoenix — restarting as TypeScript.

Work to do:

1. Initialize Bun + TypeScript project: package.json, tsconfig.json (strict), biome.json.

2. Set up React Router 7 (framework mode, SPA-first with `ssr: false` in react-router.config.ts) + Vite + Tailwind CSS 4 + shadcn/ui.

3. Build the initial app:
   - Landing/home page with project description
   - Game board component — 8x8 grid, piece rendering with SVG or Unicode, click-to-select and click-to-move interaction
   - Game state powered by chess.js (or equivalent TS chess library) for move validation, check/checkmate detection
   - WebSocket-ready architecture: define a message protocol type (e.g., GameMessage with move/join/resign variants), stub a connection hook that can be wired to a real server later
   - Clean route structure: / (landing), /play (local game against yourself)

4. Add TanStack Query (wired up with QueryClientProvider, ready for future server state).

5. Standard scripts: dev, build, start, lint, format, typecheck.

6. Update README.md: replace all Elixir/Phoenix/LiveView/BEAM references with the actual TypeScript stack. Keep the vision, project name, and feature aspirations — just make the tech accurate.

7. Verify: `bun run lint` and `bun run typecheck` pass. `bun run dev` serves the app and renders a playable board.

Constraints:
- This is a foundation. Build the skeleton right so it's easy to iterate on.
- SPA-first (`ssr: false`).
- Commit as dunamismax. No AI attribution anywhere.
- Force-push to main.

Done when:
- Working React app with interactive chess board
- chess.js integrated for move validation
- `bun run lint` passes
- `bun run typecheck` passes
- `bun run dev` serves the app
- README reflects TypeScript stack

After completing: update ~/github/scryai-typescript/REPO_ALIGNMENT.md Phase 6 checkbox.
```

---

## Phase 7: Populate MANAGED_PROJECTS

```
Read ~/github/scryai-typescript/SOUL.md first, then ~/github/scryai-typescript/AGENTS.md.

Your task: populate MANAGED_PROJECTS in ~/github/scryai-typescript so `bun run scry:projects:doctor` tracks all active repos.

Current state:
- ~/github/scryai-typescript/scripts/projects.config.ts exports an empty MANAGED_PROJECTS array
- ManagedProject type (in common.ts): { name: string, path: string, installCommand: string[], verifyCommands: string[][] }

Active repos to add (all TypeScript + Bun, all under ~/github):
1. mylife-rpg
2. poddashboard
3. reactiveweb
4. repo-monitor
5. open-video-downloader
6. CallRift
7. scry-trader (assuming Phase 5 complete)
8. elchess (assuming Phase 6 complete)

Note: mtg-card-bot is intentionally remaining Python and is not tracked here.

Work to do:

1. Edit projects.config.ts. Use `join(homedir(), "github", "<name>")` for paths (import homedir from "node:os", join from "node:path").

2. For each repo:
   - installCommand: ["bun", "install"]
   - verifyCommands: [["bun", "run", "lint"], ["bun", "run", "typecheck"]]

3. Run `bun run scry:projects:doctor` — verify it reports on all repos.

4. Run `bun run lint && bun run typecheck` on scryai-typescript itself.

5. Mark Phase 7 checkboxes done in REPO_ALIGNMENT.md.

Constraints:
- Commit as dunamismax. No AI attribution anywhere.
- Force-push to main.

Done when:
- MANAGED_PROJECTS contains all 8 active TypeScript repos
- `bun run scry:projects:doctor` reports status for every repo
- `bun run lint` and `bun run typecheck` pass on scryai-typescript
- REPO_ALIGNMENT.md Phase 7 marked complete
```
