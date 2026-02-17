# Web Template

## Purpose

`web-template/` is the canonical full-stack Rails reference application for the scry stack. It exists to demonstrate modern Rails best practices in one concrete codebase that can be copied, adapted, and used as the starting point for future product repositories.

This app is an exemplar, not a live product.

## Intent

- Show end-to-end stack integration in one place: Rails 8, SQLite, ActiveRecord, Hotwire, Tailwind CSS, Devise, Pundit, ActiveJob `:async`, cache defaults, Minitest, and RuboCop.
- Define a practical baseline architecture for solo-builder and small-team Rails projects.
- Provide a high-signal template that passes the 2am test: clear structure, readable conventions, deterministic setup, and explicit verification gates.
- Serve as an implementation reference for patterns that should repeat across product repos.

## Scope Boundary

In scope:
- App structure and conventions that represent current best-practice Rails defaults for this stack.
- Reference implementations of common web app concerns (auth, authorization, jobs, caching, testing, CI posture, deployment readiness).
- Documentation that explains what this template is for and how to use it.

Out of scope:
- Product-specific domain logic.
- Production data or environment-specific secrets.
- Becoming the long-term home of a product application.

## Current Status

- `web-template/` is implemented as the canonical stack reference app.
- Auth and authorization baseline is active (`Devise` + `Pundit`).
- Reference domain (`Project`) demonstrates user ownership and policy scoping.
- Dashboard caching and async job flow is implemented (`DashboardSnapshot` + `DashboardRefreshJob`).
- Tailwind + Hotwire UI patterns are present and tested.

## Definition of Ready (Before Building Features)

- Intent, boundaries, and success criteria are documented and agreed.
- Stack choices stay aligned with `AGENTS.md`.
- Verification gates for template changes are clear (`bundle exec rubocop`, `bundle exec rake test`, and template-specific checks as they are added).
- README/docs language stays explicit that this is a reference template, not a product.

## Success Criteria

The template is successful when:
- A new repo can be initialized from it with minimal edits.
- Core stack capabilities are represented with clear, maintainable examples.
- Setup and verification are deterministic on Ubuntu.
- The code and docs remain current-state and opinionated, without drift into generic boilerplate.

## Implemented Baseline

- Routing:
  - Root path is authenticated dashboard (`/` -> `DashboardController#show`).
  - Resource surface includes `projects` and Devise routes.
- Auth:
  - Devise user model and migration are included.
  - Layout includes signed-in and signed-out navigation states.
- Authorization:
  - Pundit is integrated at `ApplicationController`.
  - `ProjectPolicy` restricts data and actions to owner records.
- Domain:
  - `Project` belongs to `User` and uses enum statuses (`draft`, `active`, `archived`).
  - Project writes enqueue dashboard snapshot refresh jobs.
- Caching and jobs:
  - `DashboardSnapshot` reads/writes cache payloads.
  - `DashboardRefreshJob` refreshes cached snapshot asynchronously.
  - Queue adapter is `:async` globally; test environment uses `:test` adapter.
- Cache posture:
  - Development and test use `:memory_store`.
  - Production uses `:file_store` at `tmp/cache`.
- Testing:
  - Minitest coverage includes controller authz flows, model behavior, service payload, and job refresh behavior.
- Quality:
  - RuboCop and full test suite are first-class verification gates.
