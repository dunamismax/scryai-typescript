# web-template

Canonical full-stack Rails 8 reference app for the scry stack.

## Stack

- Ruby 3.2+
- Rails 8 monolith (web + API surface + jobs)
- SQLite + ActiveRecord
- Hotwire (Turbo + Stimulus)
- Tailwind CSS
- Devise + Pundit
- ActiveJob `:async`
- Cache stores: `:memory_store` (development/test), `:file_store` (production)
- Minitest + Capybara
- RuboCop (`rubocop-rails-omakase`)
- Bundler

## Reference Features

- Devise authentication with register/sign-in/sign-out flows.
- Pundit authorization for project ownership boundaries.
- `Project` domain example with enum statuses and user scoping.
- Hotwire-first UI with Turbo navigation and a Stimulus `autosubmit` filter.
- Cached dashboard snapshot (`DashboardSnapshot`) refreshed by `DashboardRefreshJob`.
- Health endpoint (`/up`) and self-hosted production defaults (SQLite + file cache).

## Local Setup

From `web-template/`:

```bash
bundle install
bundle exec rake db:prepare
```

Run in development:

```bash
bin/dev
```

## Verification Gates

From `web-template/`:

```bash
bundle exec rubocop
bundle exec rake test
bundle exec rake routes
bundle exec rake zeitwerk:check
```

## Notes

- This app is a template and exemplar, not a product deployment target.
- Keep docs current-state only.
- Prefer small, intention-revealing diffs when evolving this reference app.
