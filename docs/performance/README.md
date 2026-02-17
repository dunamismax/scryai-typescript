# Performance CI

Lighthouse quality gates from `scryai` run against `~/github/astro-web-template` by default in both **mobile** and **desktop** modes.

## Metrics gated

- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- TBT (Total Blocking Time)
- Category scores: Performance, Accessibility, Best Practices, SEO

## Local run

From `scryai` repo root:

```bash
# Build + run Lighthouse mobile + desktop (3 runs each)
bun run perf:lighthouse

# Assert absolute thresholds
bun run perf:lighthouse:assert -- --report artifacts/lighthouse/current.json

# Assert thresholds and deltas vs baseline report
bun run perf:lighthouse:assert -- --report artifacts/lighthouse/head.json --baseline artifacts/lighthouse/base.json
```

Override target project path explicitly:

```bash
bun run perf:lighthouse -- --app-dir ~/github/astro-web-template
```

Lighthouse requires a local Chrome/Chromium executable.

- Auto-detected binaries: `google-chrome-stable`, `google-chrome`, `chromium`, `chromium-browser`, `brave-browser`, `microsoft-edge-stable`
- Override explicitly:

```bash
CHROME_PATH=/usr/bin/google-chrome-stable bun run perf:lighthouse
```

Ubuntu/Debian quick install:

```bash
sudo apt-get install -y chromium
```

If the default Lighthouse port (`4173`) is busy, the runner now auto-retries on the next ports.

Threshold config: `docs/performance/lighthouse-thresholds.json`
