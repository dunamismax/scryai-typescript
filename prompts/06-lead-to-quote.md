# Lead-to-Quote SMS Agent — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **QuoteBot** (working name) — an AI agent that handles inbound business leads via SMS and WhatsApp. When a potential customer texts a business number, the agent qualifies the lead (budget, timeline, scope), generates a quote based on configurable pricing rules, and books an appointment on the business owner's calendar. Hands off to a human when the conversation goes off-script or the deal value exceeds thresholds.

Target audience: small businesses — contractors, agencies, freelancers, service providers. These people lose leads because they can't respond fast enough while they're on a job site. Speed-to-lead is the #1 predictor of conversion.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Backend:** Bun server with Hono
- **Database:** Postgres with Drizzle ORM
- **SMS/WhatsApp:** Twilio (SMS + WhatsApp Business API)
- **Calendar:** Google Calendar API (primary), Cal.com API (alternative)
- **LLM:** OpenAI / Anthropic API for conversation management
- **Frontend Dashboard:** React + Vite + Tailwind + shadcn/ui
- **Auth:** Better Auth
- **Formatting:** Biome
- **Validation:** Zod

## Repository Setup

- Create at `~/github/quotebot`
- `bun init`, dual remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through:

- **Conversation flow:** Inbound SMS → greeting + initial question → qualification loop (what do you need, when, budget range) → generate quote → present options → book appointment or hand off
- **Pricing engine:** Configurable pricing rules per business. Support: flat rate, per-unit, tiered, hourly estimates, custom formulas. Business owner sets these up in the dashboard.
- **Lead qualification:** Structured data extraction from conversational text. The agent asks the minimum questions needed to generate a quote. Adapts based on what info the customer volunteers upfront.
- **Calendar integration:** Check availability, propose time slots, book confirmed appointments. Send confirmation SMS with details.
- **Handoff protocol:** When the agent encounters: price objections beyond its authority, custom requirements outside pricing rules, angry/frustrated customer, explicit "talk to a person" request → notify business owner with full context and pause automated responses.
- **Multi-business:** One installation supports multiple businesses, each with their own Twilio number, pricing rules, calendar, and conversation style.
- **Analytics dashboard:** Lead volume, conversion rate (text → quote → booked), average response time, revenue attributed, conversation transcripts.
- **Compliance:** SMS opt-out handling (STOP keyword), TCPA compliance, message rate limiting, business hours configuration.

### 2. Create BUILD.md

Create `BUILD.md` in the project root:

```markdown
# QuoteBot — Build Tracker

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

- Bun + TypeScript + Hono
- Biome, Drizzle + Postgres
- React + Vite + Tailwind dashboard
- Twilio SDK setup
- Directory structure
- Docker Compose for dev
- README.md
- Initial commit and push

### 4. Execute Phase 1

Build Phase 1. Update BUILD.md.

## Key Design Principles

### Conversation Design
- **Natural, not robotic.** The agent should text like a competent human employee, not a chatbot. Short messages, appropriate use of line breaks, casual-professional tone.
- **Minimum viable questions.** Don't interrogate. If the customer says "I need a new roof, 2000 sq ft, this month" — that's enough to quote. Don't ask what they already told you.
- **Graceful degradation.** If the agent can't understand a message, ask one clarifying question. If it still can't, hand off to a human. Never loop.
- **Context memory.** If a lead texts back days later, the agent remembers the previous conversation and picks up where they left off.

### Pricing Engine
- Rule-based, not LLM-generated. The LLM extracts parameters from conversation; the pricing engine calculates deterministically.
- Support for: base price + modifiers, quantity tiers, urgency multipliers, seasonal adjustments.
- Quote presentation: clean, readable SMS format. Include line items, total, and clear next step.
- Business owner can preview and test pricing rules in the dashboard before they go live.

### Reliability
- SMS delivery is critical. Retry failed sends. Monitor delivery status.
- Queue-based message processing — don't lose messages during high load or restarts.
- Conversation state persisted in database, not in memory.
- Idempotent message processing (Twilio can send duplicate webhooks).

### Security
- Twilio webhook signature verification on all inbound.
- Customer phone numbers are PII — encrypt at rest, redact in logs.
- API keys and Twilio credentials in environment variables, never committed.
- Rate limiting per phone number to prevent abuse.

## Quality Bar

- Tests for pricing engine, conversation flow, webhook handling
- TypeScript strict, no `any`
- Structured logging with PII redaction
- Database migrations via Drizzle Kit
- Docker Compose for dev
- README with setup and Twilio configuration guide

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
