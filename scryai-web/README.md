# scryai-web

Web interface starter for the `scryai` chat experience.
This project is now a clean baseline UI scaffold, ready for backend/model wiring.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Biome

## Run

From `scryai-web`:

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Quality Gates

```bash
bun run lint
bun run typecheck
bun run build
```

## Current UI Baseline

- Responsive chat shell layout
- Typed mock conversation feed
- Composer area with quick prompt chips
- Context rail for runtime/session metadata
- Custom visual theme and animated message reveal

## Next Implementation Steps

1. Add a `POST /api/chat` route handler for model requests.
2. Stream assistant tokens into the message list.
3. Persist chats in PostgreSQL (Drizzle) with conversation/message tables.
4. Add auth and per-user conversation history.
