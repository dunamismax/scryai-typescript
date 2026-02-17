# Apps

All product applications live under `apps/`.

## Convention

- One app per directory: `apps/<app-name>/`
- Each app is end-to-end TypeScript and runs on Bun.
- Each app owns its own `package.json`, env file, and runtime config.
- Shared infra stays in root `infra/`.

## Current Apps

- `astro-web-template` — fresh Astro starter scaffold created via `npm create astro@latest` (current baseline) and target location for the full-stack Astro template rebuild
- `astro-blog-template` — Astro-based blog starter template (MDX/Markdown, search, RSS, sitemap, PWA, dynamic OG images)
