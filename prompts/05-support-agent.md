# Self-Hosted Support Agent — Bootstrap Prompt

> Paste this entire file into a fresh Claude Code / OpenClaw session to begin the build.

---

## Context

You are building **SupportKit** (working name) — a self-hostable AI support agent for SaaS products. It handles email and chat support using RAG over your knowledge base combined with action tools that can actually *do things* — issue refunds, reset passwords, check order status, escalate to humans with full context.

The key differentiator from generic AI chatbots: this agent doesn't just regurgitate docs — it takes actions. And it's fully self-hostable, so customer data never leaves your infrastructure. Privacy-first teams in healthcare, fintech, and the EU are the premium market.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript (strict mode)
- **Backend:** Bun server with Hono
- **Database:** Postgres with Drizzle ORM + pgvector (for knowledge base embeddings)
- **RAG Pipeline:** pgvector + embeddings API (OpenAI or local model)
- **LLM:** OpenAI / Anthropic API with tool-use for actions
- **Action Framework:** Typed tool definitions with Zod schemas
- **Frontend:** React + Vite + Tailwind + shadcn/ui (admin dashboard)
- **Email Integration:** Webhook-based (SendGrid, Postmark, or raw SMTP)
- **Chat Widget:** Embeddable JS widget for customer-facing chat
- **Auth:** Better Auth
- **Formatting:** Biome
- **Validation:** Zod

## Repository Setup

- Create at `~/github/supportkit`
- `bun init`, dual remotes: `github.com-dunamismax` + `codeberg.org-dunamismax`
- All commits as `dunamismax`. Zero AI attribution.

## Your First Task — Scope, Plan, and Scaffold

### 1. Scope the Project

Think through:

- **Conversation pipeline:** Inbound message (email/chat) → classify intent → retrieve relevant knowledge → select action tools → generate response → execute actions → send reply
- **Knowledge base:** Ingest docs (markdown, HTML, PDF), FAQs, past support conversations. Chunk intelligently, embed, store in pgvector. Incremental updates when docs change.
- **Action tools:** Typed, validated tools the agent can call. Examples: `refund.issue(orderId, amount, reason)`, `account.resetPassword(userId)`, `order.checkStatus(orderId)`, `ticket.escalate(reason, context)`. Each tool has a risk level and can require human approval.
- **Escalation:** When the agent can't handle a request (low confidence, policy exception, angry customer), escalate to a human with full conversation context and the agent's analysis of the issue.
- **Email handling:** Parse inbound emails, maintain thread context, generate properly formatted replies. Handle attachments.
- **Chat widget:** Lightweight, embeddable JS snippet for real-time chat on customer websites. WebSocket connection to backend.
- **Admin dashboard:** Conversation list, agent performance metrics (resolution rate, escalation rate, response time), knowledge base management, action tool configuration, approval queue.
- **Multi-tenant:** Support multiple products/brands from one installation, each with their own knowledge base and action tools.

### 2. Create BUILD.md

Create `BUILD.md` in the project root:

```markdown
# SupportKit — Build Tracker

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
> [Self-contained prompt for fresh agent session]

---

[All phases to MVP]

---

### Future Phases (Post-MVP)
- [ ] ...
```

Phase prompts: **fully self-contained**.

### 3. Scaffold

- Bun + TypeScript + Hono server
- Biome, Drizzle + Postgres + pgvector
- React + Vite + Tailwind dashboard
- Directory structure per architecture
- Docker Compose for dev
- README.md
- Initial commit and push

### 4. Execute Phase 1

Build Phase 1. Update BUILD.md.

## Key Design Principles

### Action Tool Framework
- Tools are defined as typed schemas (Zod). The LLM calls them by name with validated parameters.
- Each tool declares: name, description, parameter schema, risk level (auto/approve/block), and an execute function.
- Tool results are fed back into the conversation — the agent can chain actions.
- Adding a new tool is: define schema + write execute function + register. No framework changes needed.

### RAG Quality
- Chunk by semantic boundaries (sections, paragraphs), not arbitrary character counts.
- Hybrid search: vector similarity + keyword matching for best recall.
- Source attribution in responses — "Based on [doc name], here's..."
- Freshness scoring — prefer recently updated docs over stale ones.
- Admin can flag bad retrievals to improve quality over time.

### Conversation Management
- Full conversation history stored and searchable.
- Agent maintains context across messages in a thread.
- Sentiment tracking — escalate before the customer has to ask.
- CSAT collection after resolution.

### Privacy & Security
- All data stays on-premises. No external calls except to LLM API (configurable to use local models).
- PII detection and redaction in logs.
- Audit trail for every action taken.
- Role-based access in admin dashboard.
- Data retention policies configurable per-tenant.

## Quality Bar

- Tests for action tools, RAG pipeline, conversation flow
- TypeScript strict, no `any`
- Structured logging with PII redaction
- Database migrations via Drizzle Kit
- Docker image for self-hosting
- README with setup guide and integration docs

## Go

Scope → BUILD.md → Scaffold → Phase 1. Work autonomously. Report when done.
