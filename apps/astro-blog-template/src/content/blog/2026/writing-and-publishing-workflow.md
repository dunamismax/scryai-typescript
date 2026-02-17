---
title: "Writing and Publishing Workflow"
description: "A practical workflow for drafting, reviewing, and publishing posts."
pubDatetime: 2026-02-17T10:00:00Z
tags: ["workflow", "writing", "publishing"]
draft: false
---

A reliable posting loop:

1. Draft in `src/content/blog/<year>/<slug>.md`.
2. Keep frontmatter complete (`title`, `description`, `pubDatetime`).
3. Run `bun run lint`, `bun run typecheck`, and `bun run build`.
4. Review generated pages and search locally.
5. Publish once checks are green.

Small, repeatable steps keep quality high without slowing down shipping.
