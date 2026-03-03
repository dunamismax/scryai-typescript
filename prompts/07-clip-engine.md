# Creator Clip Engine — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **ClipForge** (working name) — an AI agent that ingests long-form video and podcast content, identifies the most viral-worthy segments, auto-clips and formats them for social platforms (TikTok, Reels, Shorts, Twitter), adds captions, and queues them for posting.

Every creator with a podcast or YouTube channel needs clips for social distribution. Current tools (Opus Clip, Vizard) are cloud-only and expensive. A self-hostable option with better AI selection — trained on what actually goes viral, not just "loud moments" — has clear differentiation.

## Tech Stack

- **Runtime:** Bun (orchestration layer)
- **Language:** TypeScript (strict mode) for orchestration + Python for ML/NLP scoring
- **Video Processing:** ffmpeg (CLI, not a wrapper library)
- **Transcription:** Whisper (local or API)
- **LLM:** OpenAI / Anthropic API for segment analysis and caption generation
- **Backend:** Bun server with Hono
- **Database:** Postgres with Drizzle ORM
- **Frontend:** React + Vite + Tailwind + shadcn/ui
- **Queue:** BullMQ or custom Postgres-based job queue (video processing is async)
- **Formatting:** Biome (TypeScript), Ruff (Python)
- **Validation:** Zod

## Repository Setup

- Create at `~/github/clipforge`
- `bun init`, dual remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through:

- **Ingestion pipeline:** YouTube URL (or file upload) → download video → extract audio → transcribe with Whisper → generate timestamped transcript
- **Segment scoring:** Analyze transcript for viral-worthy segments using multiple signals:
  - Emotional intensity (surprise, humor, controversy, insight)
  - Self-contained narrative (makes sense without context)
  - Hook quality (first 3 seconds grab attention)
  - Quotability (contains a shareable one-liner)
  - Engagement pattern matching (structure similar to known viral clips)
- **Clip extraction:** Given segment timestamps → extract video clip with ffmpeg → crop/pad to target aspect ratio (9:16 for vertical, 1:1 for square, 16:9 for landscape)
- **Caption generation:** Burn-in animated captions (word-by-word or phrase-by-phrase highlight style). Customizable font, color, position, animation style.
- **Platform formatting:** Each platform has different requirements — resolution, duration limits, safe zones. Generate platform-specific exports.
- **Review interface:** Creator reviews suggested clips before publishing. Adjust start/end timestamps, edit captions, approve/reject.
- **Batch processing:** Handle 1-3 hour podcasts. Process in background, notify when clips are ready.
- **Output management:** Organize clips by source video, export in bulk, queue for posting.

### 2. Create BUILD.md

Create `BUILD.md` in the project root:

```markdown
# ClipForge — Build Tracker

## Project Status
Current Phase: 1
Last Updated: [date]

## Architecture Decisions
[Key decisions]

## Phase Plan

### Phase 1: [Name]
**Goal:** [deliverable]
**Status:** In Progress

#### Deliverables
- [ ] ...

#### Phase 1 Prompt
> [Self-contained prompt]

---

[All phases to MVP]

---

### Future Phases (Post-MVP)
- [ ] ...
```

Phase prompts: **fully self-contained**.

### 3. Scaffold

- Bun + TypeScript orchestration layer
- Python virtual environment for ML/NLP scoring module
- ffmpeg availability check
- Biome + Ruff configs
- Drizzle + Postgres
- React + Vite + Tailwind dashboard
- Job queue setup
- Directory structure
- Docker Compose for dev (Postgres + Whisper API or local model)
- README.md
- Initial commit and push

### 4. Execute Phase 1

Build Phase 1. Update BUILD.md.

## Key Design Principles

### Video Processing Architecture
- **ffmpeg is the engine.** Don't use wrapper libraries that abstract away control. Shell out to ffmpeg with typed command builders.
- **Processing is async.** Video work takes minutes to hours. Job queue with progress tracking. WebSocket updates to the dashboard.
- **Intermediate artifacts:** Keep the transcript, segment scores, and raw clips as separate artifacts. Don't couple the pipeline — a user should be able to re-score segments without re-transcribing.

### Segment Scoring
- **Multi-signal scoring.** No single heuristic. Combine: transcript sentiment analysis, speaking pace changes (excitement), topic novelty within the episode, narrative completeness, hook strength.
- **LLM as a judge.** After heuristic pre-filtering, use LLM to evaluate top candidates: "Would this segment work as a standalone 60-second clip for TikTok? Score 1-10 and explain why."
- **Calibration over time.** Track which clips the creator actually approves and posts. Use this to tune scoring for their content style.
- **Segment boundaries.** Clips should start at natural sentence beginnings and end at natural conclusions. No mid-sentence cuts. Add 0.5s padding.

### Caption System
- **Word-level timestamps** from Whisper for precise caption sync.
- **Multiple styles:** Classic subtitle, karaoke-style word highlight, all-caps impact text, minimal lower-third.
- **Safe zones:** Keep captions out of platform UI overlay areas (bottom bar on TikTok, etc.).
- **Preview before burn-in.** Show caption preview in dashboard, then render to video on approval.

### Platform Exports
| Platform | Aspect | Max Duration | Resolution | Notes |
|---|---|---|---|---|
| TikTok/Reels/Shorts | 9:16 | 60s (ideal), 3min max | 1080x1920 | Caption safe zone matters |
| Twitter/X | 1:1 or 16:9 | 2:20 | 1080x1080 or 1920x1080 | Auto-play silent — captions critical |
| YouTube | 16:9 | Any | 1920x1080 | Thumbnail frame extraction |
| LinkedIn | 1:1 or 16:9 | 10min | 1080x1080 or 1920x1080 | Professional tone auto-adjust? |

### Performance
- Transcription: ~10x real-time with Whisper large-v3 on CPU, faster on GPU.
- Clip extraction: ffmpeg is fast — seconds per clip.
- Caption rendering: the bottleneck. Pre-render caption overlay, then composite in one ffmpeg pass.
- Total pipeline for a 1-hour podcast → 5-10 clips: target under 15 minutes on a mid-range server.

## Quality Bar

- Tests for segment scoring, ffmpeg command generation, caption positioning
- TypeScript strict, no `any`
- Python code typed (pyright) and formatted (Ruff)
- Structured logging with job correlation IDs
- Database migrations via Drizzle Kit
- Docker Compose with all dependencies
- README with setup guide and example output

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
