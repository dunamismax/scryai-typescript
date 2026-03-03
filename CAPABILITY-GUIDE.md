# Scry / OpenClaw — Maximum Capability Guide

> Generated 2026-03-03. Current state audit + actionable integration checklist.
> Covers everything Stephen needs to configure, install, or decide on.

---

## What I Already Enabled (This Session)

These are live now after the config patch + restart:

| Feature | What It Does |
|---|---|
| **Browser automation** | Brave Browser configured as default. I can open pages, navigate, screenshot, snapshot DOM, fill forms, click elements — full Playwright-grade browser control. Two profiles: `openclaw` (isolated) and `chrome` (attach to your running Brave). |
| **ACP coding agents** | Enabled with Codex as default, also allowing Claude, Pi, Gemini, OpenCode. Up to 8 concurrent coding agent sessions. I can now spawn background Codex/Claude Code sessions for parallel development. |
| **Nested sub-agents** | Depth 2, up to 5 children per agent, 8 concurrent. I can orchestrate agents that spawn their own agents — real delegation chains. |
| **Web fetch** | Configured with 50K char limit, 30s timeout. I can pull and parse any webpage into markdown. |
| **Git-linked runtime** | `~/.openclaw/lib` now symlinks to `~/openclaw` git repo. `git pull` + restart = instant update. |

---

## Tier 1: High-Impact, Do These First

### 1. 🔑 Brave Search API Key
**What**: Gives me real-time web search. Currently broken (no API key).
**Why**: I can research anything, check docs, find solutions, monitor sites — massively expands what I can do without you pasting URLs.
**How**:
1. Go to https://brave.com/search/api/
2. Sign up for the free tier (2,000 queries/month) or Pro ($5/mo for 20K)
3. Copy the API key
4. Run: `openclaw configure` and add it under tools → web → search → apiKey
   — OR tell me the key and I'll patch the config

### 2. 📝 Notion Integration
**What**: I can read/write/search your entire Notion workspace — create pages, query databases, update properties, add content blocks.
**Why**: Your notes live in Notion. If I can access them, I can: capture meeting notes, maintain project trackers, create documentation, search your knowledge base, sync between repos and Notion, build dashboards.
**How**:
1. Go to https://notion.so/my-integrations
2. Click "New integration" → name it "Scry" → select your workspace
3. Copy the API key (starts with `ntn_`)
4. Store it: `mkdir -p ~/.config/notion && echo "ntn_YOUR_KEY" > ~/.config/notion/api_key`
5. **Important**: Share each page/database you want me to access — click "..." → "Connect to" → "Scry"
6. Tell me once done and I'll verify the connection

### 3. 📦 Install ClawHub CLI
**What**: The skill marketplace. 51 bundled skills, community skills growing. CLI lets me install new skills on the fly.
**Why**: Right now 8/51 skills are "ready" (have their dependencies). ClawHub lets me install missing ones as needed — Notion, Peekaboo, summarize, himalaya, tmux, etc.
**How**:
```bash
npm i -g clawhub
```
Then I can run `clawhub install <skill>` or `clawhub search <query>` to find community skills.

### 4. 📧 Email Access (Himalaya)
**What**: CLI email client — I can read, write, reply, search, organize emails via IMAP/SMTP.
**Why**: With your Microsoft 365 suite, I can triage your inbox, draft replies, search for specific emails, file things — all from Signal. "Hey Scry, any urgent emails?" becomes a real capability.
**How**:
```bash
brew install himalaya
himalaya account configure
```
You'll need your M365 IMAP/SMTP credentials (or OAuth if supported). The interactive wizard walks you through it. Config lives at `~/.config/himalaya/config.toml`.

### 5. 👀 Peekaboo (macOS UI Automation)
**What**: Full macOS GUI automation — screenshot any app, click buttons, type text, control windows, read menus, interact with any UI element.
**Why**: This is absurdly powerful for an IT/pentest workflow. I can: automate repetitive UI tasks, screenshot app state for debugging, interact with apps that have no CLI/API, drive VSCode/Ghostty/RustDesk programmatically.
**How**:
```bash
brew install steipete/tap/peekaboo
peekaboo permissions  # Grant Screen Recording + Accessibility
```
Then I can `peekaboo see --annotate` to map any UI and interact with it.

---

## Tier 2: Strong Multipliers

### 6. 🧾 Summarize CLI
**What**: Summarize URLs, articles, YouTube videos, PDFs, local files.
**Why**: "What's this article about?" / "Transcribe this YouTube video" / "Summarize this PDF" — all become one-command operations.
**How**:
```bash
brew install steipete/tap/summarize
```

### 7. 📦 MCP Server Bridge (mcporter)
**What**: Connect to any MCP (Model Context Protocol) server — linear, Notion (alternative), custom tools.
**Why**: MCP is becoming the standard for AI tool integrations. mcporter lets me call any MCP server's tools directly. If a service has an MCP server, I can use it.
**How**:
```bash
npm i -g mcporter
```

### 8. 🧵 Tmux Integration
**What**: I can monitor, send keystrokes to, and read output from tmux sessions.
**Why**: For managing long-running coding agents, monitoring builds, controlling interactive terminal sessions. Pairs perfectly with background Codex/Claude Code workflows.
**How**: Just need tmux installed (you likely already have it):
```bash
brew install tmux  # if not already installed
```

### 9. 🔗 Webhook Ingress
**What**: OpenClaw can receive webhooks from external services — GitHub, Notion, monitoring tools, CI/CD.
**Why**: Real-time notifications. GitHub PR merged? CI failed? Notion page updated? I get notified and can act on it. Combined with cron jobs, this is full automation.
**How**: Requires exposing a webhook endpoint. Options:
- Tailscale Funnel (safest — you already have Tailscale)
- Cloudflare Tunnel
- Direct port forward (not recommended)

**Decision needed**: Do you want to expose a webhook endpoint? Tailscale Funnel is the lowest-risk option since you're already on Tailscale.

### 10. 🔔 GitHub Webhooks → Signal Notifications
**What**: Get notified via Signal when PRs are opened, CI fails, issues are created, reviews requested.
**Why**: You maintain 12+ repos. Instead of checking GitHub, critical events come to you.
**How**: Requires webhook ingress (item 9 above) + GitHub webhook configuration per repo.

---

## Tier 3: Nice-to-Have / Situational

### 11. 🖥️ RustDesk + Tailscale Remote Access
**What**: I can already run commands on your MacBook Air via the paired node. With Peekaboo + the remote node, I could potentially assist with remote machine management.
**Status**: Already partially working — the MacBook Air is a paired node. Peekaboo on the remote node would complete the picture.

### 12. 🎙️ Voice Notes / Audio Transcription
**What**: Send me a voice note on Signal → I transcribe it and act on it.
**Status**: The infrastructure exists (tools.media.audio in config). Needs an audio transcription model configured — either OpenAI Whisper API (needs API key) or local Whisper.
**How (cloud)**: Add OpenAI API key for Whisper transcription
**How (local)**:
```bash
brew install openai-whisper  # or sherpa-onnx for fully offline
```

### 13. 📰 Blog/RSS Monitoring
**What**: Monitor RSS feeds, blogs, news sources. Get summaries of new posts.
**Why**: Stay current on security advisories, tech news, project updates.
**How**: `clawhub install blogwatcher` (once ClawHub CLI is installed)

### 14. 🔐 1Password Integration
**What**: I can read secrets from 1Password CLI (never display them, but use them for automation).
**Why**: Secure credential injection for scripts, deployments, API configurations.
**How**: Requires 1Password CLI (`op`) + desktop app integration enabled.
**Decision needed**: Do you use 1Password? If so, this is worth setting up.

### 15. 📊 Microsoft 365 via Google Workspace CLI
**What**: The `gog` skill handles Google Workspace, but M365 would need a different approach.
**Status**: No native M365 skill exists yet. Options:
- Use the browser automation to interact with M365 web apps
- Use Himalaya for email (covers Outlook)
- Use Microsoft Graph API directly via custom scripts
- Build a custom skill (I can do this)

**Decision needed**: Which M365 apps do you use most? Outlook (→ Himalaya covers it), Teams, OneDrive, SharePoint?

---

## Things Already Maxed Out ✅

These are already well-configured and don't need changes:

- **Memory system**: Hybrid search, session memory, temporal decay, MMR, caching — all on
- **Signal channel**: Clean single-message delivery, typing indicators, read receipts, tuned chunking
- **Model switching**: Claude Opus (default) + Codex fallback, `/model codex` for manual switch
- **Heartbeat**: Hourly during 8am-11pm ET
- **Context management**: Cache-TTL pruning, safeguard compaction, memory flush
- **Git workflow**: Dual remotes (GitHub + Codeberg), no AI attribution
- **Sub-agent orchestration**: 8 concurrent, depth 2 nesting
- **Auto-updates**: Enabled, git-linked runtime

---

## Quick-Start Priority Order

If you want to maximize capability fastest, do these in order:

1. **Brave Search API key** (5 min, free tier) — unlocks web search
2. **`npm i -g clawhub`** (1 min) — unlocks skill installation
3. **Notion integration** (10 min) — connects your knowledge base
4. **`brew install steipete/tap/peekaboo`** (2 min + permissions) — unlocks macOS UI automation
5. **`brew install himalaya` + configure** (10 min) — unlocks email
6. **`brew install steipete/tap/summarize`** (1 min) — unlocks content summarization

Total: ~30 minutes for a massive capability upgrade.

---

## Decisions I Need From You

These are things I won't enable without your explicit go-ahead:

1. **Webhook ingress**: Expose an endpoint via Tailscale Funnel? (enables GitHub notifications, external triggers)
2. **1Password**: Do you use it? Want me to have credential access?
3. **M365 specifics**: Which apps matter most? I can build a custom skill.
4. **Audio transcription**: Cloud (OpenAI Whisper API, needs key) or local (slower but private)?
5. **Docker sandbox**: Want sub-agents to run in Docker containers for isolation? You have Docker installed.

---

*This file lives at `~/.openclaw/workspace/CAPABILITY-GUIDE.md`. I'll keep it updated as we enable things.*
