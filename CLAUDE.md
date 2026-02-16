# CLAUDE.md

> **This is a living document.** It must be kept accurate and up to date at all times. Update this file whenever new conventions, tools, preferences, or instructions are established. Prune anything that becomes outdated. Short, explicit, actionable instructions outperform long vague ones -- keep it tight.

## First Things First

**Read `SOUL.md` before doing anything.** That file defines who Stephen is, who Claude is in this partnership, and the spirit of how we work. Keep it updated as you learn new things.

## Owner

- **Name:** Stephen
- **Environment:** Ubuntu VM (WSL2), terminal-first workflow
- **Home:** `/home/sawyer`
- **Projects Root:** `/home/sawyer/github/`

---

## Tech Stack (Mandatory -- No Exceptions)

| Layer | Tool | Notes |
|---|---|---|
| **Language** | TypeScript | Everything. Apps, scripts, automation, glue code, one-off tasks. Always `.ts`, never `.js`. |
| **Script Runtime** | Bun | All scripts run with `bun run`. Use `bun` for package management too. |
| **Full-Stack Framework** | TanStack Start | The only framework. Do not suggest Next.js, Remix, Nuxt, SvelteKit, or anything else. |
| **Routing** | TanStack Router | File-based, type-safe routing. |
| **Server State** | TanStack Query | All server/async state. Never raw `fetch` in components. |
| **Tables** | TanStack Table | When tabular data is needed. |
| **Forms** | TanStack Form | When forms are needed. |
| **Styling** | *(To be decided -- update when Stephen picks one)* | |
| **Database/ORM** | *(To be decided -- update when Stephen picks one)* | |
| **Auth** | *(To be decided -- update when Stephen picks one)* | |

### Why This Stack

- TanStack is framework-agnostic at its core, type-safe by default, and Tanner Linsley ships quality.
- Bun is fast, runs TypeScript natively, and eliminates tooling friction.
- TypeScript everywhere means one language, one mental model, zero context-switching.

---

## Workflow: Explore, Plan, Code, Commit

Follow this order for any non-trivial task:

1. **Explore** -- Read relevant files. Understand existing code before touching it. Never propose changes to code you haven't read.
2. **Plan** -- Formulate a strategy. For anything beyond a small fix, discuss the approach before writing code.
3. **Code** -- Implement. Keep changes minimal and focused.
4. **Verify** -- Run tests, type-check, or manually verify. Never ship unverified code.
5. **Commit** -- Atomic commits with clear "why" messages.

---

## Git & GitHub Rules

- **Never push directly to main/master.** Always work on feature branches and create pull requests.
- **Never force push.** No `--force`, no `reset --hard` on shared branches.
- **Never skip hooks.** No `--no-verify`.
- Commit messages describe the *why*, not the *what*. The diff shows what changed.
- Keep commits atomic -- one logical change per commit.
- Branch naming: `feature/description`, `fix/description`, `chore/description`.

---

## Permissions & Safety

### Do Without Asking

- Read any file
- Search the codebase
- Run type-checking (`bun run typecheck`, `tsc --noEmit`)
- Run tests
- Run linters
- Create feature branches
- Write or edit code files as part of an agreed-upon task

### Ask Before Doing

- Installing or removing packages/dependencies
- Deleting files or directories
- Modifying CI/CD configuration
- Changing project structure significantly
- Any operation that affects systems outside the local repo
- Running database migrations
- Creating new projects/repos

---

## Code Standards

### Do

- Write clean, readable TypeScript with proper types. Infer where possible, annotate where necessary.
- Prefer `const` over `let`. Never use `var`.
- Use async/await over raw promises.
- Use TanStack Query for all server state -- mutations, queries, invalidation.
- Use TanStack Router's type-safe patterns -- `Link`, route params, search params.
- Handle errors at system boundaries (user input, API responses, external data).
- Name things clearly. A good name eliminates the need for a comment.
- Prefer early returns over deep nesting.
- Prefer flat over nested. Prefer simple over clever.

### Don't

- Don't use `any`. If you're reaching for `any`, the types are wrong -- fix them.
- Don't use raw `fetch` in components. That's what TanStack Query is for.
- Don't hardcode values that could change (URLs, keys, magic numbers). Use config/env.
- Don't add comments to code you didn't write or change.
- Don't create abstractions for things used only once. Three similar lines > premature abstraction.
- Don't add error handling for impossible states. Trust internal code.
- Don't over-engineer. Solve today's problem, not next year's hypothetical.
- Don't leave `console.log` in production code. Use proper logging if needed.
- Don't use `index` as a key in lists with dynamic items.
- Don't mix server state and client state. They are different concerns.

---

## File-Scoped Commands

Use these to verify changes without running full project builds:

```bash
# Type-check a single file
bun run tsc --noEmit path/to/file.ts

# Run a single test file
bun test path/to/file.test.ts

# Lint a single file (when linter is configured)
# bun run lint path/to/file.ts
```

*(Update these as projects are configured.)*

---

## Testing Strategy

*(To be configured per-project. Update this section when decisions are made.)*

Defaults until otherwise specified:

- Test runner: Bun's built-in test runner (`bun test`)
- Focus on integration tests over unit tests where practical
- Test behavior, not implementation details
- Every bug fix should include a regression test

---

## Project Structure Conventions

*(To be updated as projects are created and patterns emerge.)*

Standard TanStack Start project layout:

```
app/
  routes/          # File-based routes
  components/      # Shared UI components
  lib/             # Utilities, helpers, shared logic
  hooks/           # Custom hooks
  styles/          # Stylesheets
  server/          # Server-only code (API handlers, db)
```

---

## Active Projects

| Project | Path | Status | Description |
|---|---|---|---|
| Claude | `/home/sawyer/github/Claude` | Active | Meta-repo: Claude's identity, config, and documentation |

*(Add projects here as they are created.)*

---

## Lessons Learned

*(Log non-obvious discoveries, gotchas, and hard-won knowledge here. Future sessions benefit from past pain.)*

| Date | Lesson |
|---|---|
| 2026-02-16 | Initial setup. AGENTS.md renamed to CLAUDE.md per Claude Code conventions. |

---

## Notes

*(Running notes, reminders, and context.)*
