---
title: "Customize Site Metadata"
description: "Set your site title, author profile, and social links in one pass."
pubDatetime: 2026-02-17T09:30:00Z
tags: ["guide", "configuration"]
draft: false
---

Start with `src/consts.ts`:

1. Set `website`, `title`, `author`, and `desc`.
2. Replace `ogImage` and profile URL.
3. Configure post pagination and edit-link behavior.

Then update `src/constants.ts` to enable only the social links you actually use.

This keeps metadata, schema, and UI links consistent everywhere.
