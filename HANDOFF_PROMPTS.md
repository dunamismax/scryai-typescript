# Handoff Prompts

> Copy-paste each phase prompt into a fresh coding agent session (Claude Code, Codex, etc.).
> Execute phases in order. Each phase is self-contained.
> After each phase, verify the done criteria before moving to the next.

---

## Phase 4: Align CallRift (Mobile)

```
Read CLAUDE.md first, then SOUL.md and AGENTS.md in the scryai-typescript repo at ~/github/scryai-typescript for identity and operational rules.

Your task: align the CallRift React Native app at ~/github/CallRift with our stack baseline.

Current state:
- React Native + Expo (SDK 52), React 18.3, TypeScript
- Uses zustand for state management
- Uses expo lint (ESLint under the hood)
- No Biome, no CLAUDE.md (already added), no TanStack Query
- babel.config.js present
- bun.lock exists (already using Bun)

Work to do:
1. Check the latest stable Expo SDK version. If SDK 52 supports React 19, upgrade React to 19+. If not, upgrade to the latest Expo SDK that does, then upgrade React. If React 19 is not yet supported by Expo, document that constraint and leave React at 18.3 — do NOT force an incompatible upgrade.
2. Replace expo lint / ESLint with Biome. Remove all ESLint config and deps. Add @biomejs/biome as a devDependency. Create a biome.json matching the one in ~/github/scryai-typescript (latest schema, indentStyle: space, recommended rules, ignoreUnknown, exclude node_modules/.expo/dist). Update package.json lint script to use `bunx @biomejs/biome check .`.
3. Evaluate zustand usage. If it's used for simple client-side UI state (theme, preferences), keep it. If it's used for server/async data fetching, replace those parts with TanStack Query. Add @tanstack/react-query if needed. Don't force TanStack Query where zustand is the right tool.
4. Run `bun run lint` and `bun run typecheck` and fix any errors. Warnings are acceptable.
5. Update the README.md tech stack table to reflect any changes made.

Constraints:
- Do NOT change any app functionality or UI.
- Do NOT add SOUL.md or AGENTS.md to this repo (CLAUDE.md is already there).
- Commit as dunamismax. No AI attribution anywhere. No "Claude", "Scry", "Co-Authored-By", or AI references in commits.
- Push directly to main with force-push. Dual remotes (GitHub + Codeberg) are configured — one `git push --force origin main` hits both.
- Keep commits atomic and focused.

Done criteria:
- `bun run lint` passes (warnings OK, zero errors)
- `bun run typecheck` passes
- React version is latest compatible with current Expo SDK
- Biome replaces ESLint entirely
- No ESLint config or deps remain
- README reflects current stack
```

---

## Phase 5: Rewrite mtg-card-bot in TypeScript

```
Read CLAUDE.md first, then SOUL.md and AGENTS.md in the scryai-typescript repo at ~/github/scryai-typescript for identity and operational rules.

Your task: rewrite the mtg-card-bot Discord bot from Python to TypeScript + Bun.

Current state:
- Repo: ~/github/mtg-card-bot
- Python Discord bot using the Scryfall API for Magic: The Gathering card lookups
- Features: prefix commands, bracket syntax [[Card Name]], random pulls, rules lookup, rich embeds with prices/legality, rate limiting, Scryfall API throttling
- Uses: Python 3.12+, uv package manager, discord.py
- Has: manage_bot.py, mtg_card_bot/ package, pyproject.toml, uv.lock

Work to do:
1. Create a fresh TypeScript + Bun project in the same repo. Remove all Python files (pyproject.toml, uv.lock, manage_bot.py, mtg_card_bot/).
2. Use discord.js as the Discord library. Add it as a dependency with `bun add discord.js`.
3. Reimplement all existing features: card lookup (prefix + bracket syntax), random card, rules lookup, multi-card queries, rich embeds with prices/legality, per-user rate limiting, Scryfall API throttling.
4. Use Zod for any input/config validation.
5. Add Biome for linting/formatting (biome.json matching scryai-typescript).
6. Structure: src/ directory with clean module separation. Entry point: src/index.ts.
7. Add standard scripts to package.json: start, dev, lint, format, typecheck.
8. Config via environment variables (DISCORD_TOKEN at minimum). Use .env support via Bun's built-in env loading.
9. Update README.md to reflect the TypeScript rewrite. Keep the feature list accurate.
10. Verify: `bun run lint` and `bun run typecheck` must pass.

Constraints:
- Preserve ALL existing bot functionality. This is a rewrite, not a reduction.
- Do NOT add SOUL.md or AGENTS.md (CLAUDE.md is already there).
- Commit as dunamismax. No AI attribution anywhere.
- Push directly to main with force-push.
- TypeScript strict mode. Bun runtime. Biome linting. No ESLint/Prettier.

Done criteria:
- Zero Python files remain
- All original features reimplemented in TypeScript
- `bun run lint` passes
- `bun run typecheck` passes
- README is updated
- Bot can start with `bun run start` (given DISCORD_TOKEN env var)
```

---

## Phase 5b: Rewrite scry-trader in TypeScript

```
Read CLAUDE.md first, then SOUL.md and AGENTS.md in the scryai-typescript repo at ~/github/scryai-typescript for identity and operational rules.

Your task: rewrite scry-trader from Python to TypeScript + Bun.

Current state:
- Repo: ~/github/scry-trader
- Python trading system using Interactive Brokers (ib_async) + Anthropic Claude for analysis
- Modules: broker.py (IBKR connection), analyst.py (Claude analysis), risk.py (hard risk rules), journal.py (SQLite trade journal), models.py (Pydantic models), config.py (config.toml loader), cli.py (Click CLI)
- Uses: Python 3.12+, uv, ib_async, anthropic SDK, pydantic, click, sqlite

Work to do:
1. Evaluate TypeScript IBKR client options. Check if @stoqey/ib or similar packages exist and are viable. If no mature TS IBKR client exists, document that finding and implement a clean abstraction layer that could be backed by a REST/WebSocket bridge to IBKR's API.
2. Create a fresh TypeScript + Bun project in the same repo. Remove all Python files.
3. Reimplement: IBKR connection/portfolio/orders, Claude analysis (using @anthropic-ai/sdk), risk rules, trade journal (use better-sqlite3 or bun:sqlite), config loading (from config.toml or switch to .env + Zod), CLI (use a lightweight TS CLI framework or plain Bun.argv parsing).
4. Use Zod for all data models (replacing Pydantic).
5. Add Biome, standard scripts, TypeScript strict mode.
6. Structure: src/ directory. Entry point: src/cli.ts.
7. Update README.md.
8. Verify: `bun run lint` and `bun run typecheck` must pass.

Constraints:
- Preserve all trading functionality. Risk rules are critical — do not simplify or skip any.
- Commit as dunamismax. No AI attribution anywhere.
- Push directly to main with force-push.

Done criteria:
- Zero Python files remain
- All modules reimplemented in TypeScript
- `bun run lint` passes
- `bun run typecheck` passes
- README is updated
- CLI works with `bun run src/cli.ts`
```

---

## Phase 6: Rewrite elchess in TypeScript

```
Read CLAUDE.md first, then SOUL.md and AGENTS.md in the scryai-typescript repo at ~/github/scryai-typescript for identity and operational rules.

Your task: bootstrap the elchess repo as a TypeScript project.

Current state:
- Repo: ~/github/elchess
- README.md describes a self-hostable chess platform (inspired by Lichess)
- Currently has: README.md and CLAUDE.md only. No code.
- Original plan was Elixir/Phoenix — we're restarting as TypeScript.

Work to do:
1. Initialize a Bun + TypeScript project: package.json, tsconfig.json, biome.json.
2. Set up a React Router (framework mode, SPA-first with ssr: false) frontend with Vite, Tailwind CSS, shadcn/ui.
3. Create the initial app structure:
   - Landing page with project description
   - Game board component (8x8 chess board rendering with pieces)
   - Basic game state management using chess.js (or equivalent TS chess library) for move validation
   - WebSocket-ready architecture (define the message protocol, stub the connection layer)
4. Add TanStack Query for any future server state needs.
5. Standard scripts: dev, build, lint, format, typecheck.
6. Update README.md: change "Elixir/Phoenix/LiveView" references to the actual TypeScript stack. Keep the vision and feature descriptions but make the tech stack accurate.
7. Verify: `bun run lint` and `bun run typecheck` must pass. `bun run dev` should start the dev server and render the board.

Constraints:
- This is a foundation, not a finished product. Build the skeleton right so future work can iterate.
- SPA-first (ssr: false in react-router.config.ts).
- Commit as dunamismax. No AI attribution anywhere.
- Push directly to main with force-push.

Done criteria:
- Working React app with chess board rendering
- chess.js (or equivalent) integrated for move validation
- `bun run lint` passes
- `bun run typecheck` passes
- `bun run dev` serves the app
- README reflects TypeScript stack
```

---

## Phase 7: Populate MANAGED_PROJECTS

```
Read CLAUDE.md first, then SOUL.md and AGENTS.md in the scryai-typescript repo at ~/github/scryai-typescript for identity and operational rules.

Your task: populate the MANAGED_PROJECTS array in ~/github/scryai-typescript/scripts/projects.config.ts so that `bun run scry:projects:doctor` tracks all active repositories.

Current state:
- projects.config.ts exports an empty MANAGED_PROJECTS array
- The ManagedProject type is defined in common.ts: { name, path, installCommand, verifyCommands }

Active repos to add (all under ~/github):
- mylife-rpg (path: /Users/sawyer/github/mylife-rpg, install: bun install, verify: bun run lint + bun run typecheck)
- poddashboard (same pattern)
- reactiveweb (same pattern)
- repo-monitor (same pattern)
- open-video-downloader (same pattern)
- CallRift (same pattern)
- mtg-card-bot (same pattern — assuming Phase 5 is complete and it's TypeScript now)
- scry-trader (same pattern — assuming Phase 5b is complete)
- elchess (same pattern — assuming Phase 6 is complete)

Work to do:
1. Populate MANAGED_PROJECTS with all active TypeScript repos listed above.
2. Use $HOME/github/<name> pattern for paths (resolve with process.env.HOME or os.homedir()).
3. Install command: ["bun", "install"] for all.
4. Verify commands: [["bun", "run", "lint"], ["bun", "run", "typecheck"]] for all.
5. Run `bun run scry:projects:doctor` and verify it reports on all repos.
6. Run `bun run lint && bun run typecheck` on scryai-typescript itself.
7. Update REPO_ALIGNMENT.md: mark Phase 7 checkboxes as done.

Constraints:
- Commit as dunamismax. No AI attribution anywhere.
- Push directly to main with force-push.

Done criteria:
- MANAGED_PROJECTS contains all active TypeScript repos
- `bun run scry:projects:doctor` reports status for every repo
- `bun run lint` and `bun run typecheck` pass on scryai-typescript
- REPO_ALIGNMENT.md Phase 7 is marked complete
```
