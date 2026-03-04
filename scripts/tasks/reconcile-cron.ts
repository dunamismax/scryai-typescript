/**
 * reconcile-cron
 *
 * Single-manifest source of truth for all managed cron jobs.
 * Reads the manifest, compares against live cron state via the `openclaw` CLI,
 * and converges: creates missing jobs, patches drifted fields, removes orphans.
 *
 * Default: dry-run (report only). Pass `--apply` to write changes.
 * Pass `--scope=smoke` to reconcile only specialist smoke jobs (default).
 * Pass `--scope=all` to reconcile ALL managed jobs in the manifest.
 *
 * Usage:
 *   bun run scry:cron:reconcile               # dry-run
 *   bun run scry:cron:reconcile -- --apply     # apply changes
 */

import { homedir } from "node:os";
import { join } from "node:path";
import { logStep, runOrThrow } from "../common";

const HOME = process.env.HOME ?? homedir();
const WS = join(HOME, ".openclaw");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CronSchedule = {
  kind: "cron";
  expr: string;
  tz: string;
};

type CronDelivery = {
  mode: "announce" | "none";
  channel?: string;
  to?: string;
  bestEffort?: boolean;
};

type ManagedJob = {
  name: string;
  scope: "smoke" | "system";
  schedule: CronSchedule;
  sessionTarget: "isolated" | "main";
  payload: {
    kind: "agentTurn" | "systemEvent";
    model?: string;
    thinking?: string;
    timeoutSeconds?: number;
    message: string;
  };
  delivery: CronDelivery;
  enabled: boolean;
};

type LiveJob = {
  id: string;
  name: string;
  enabled: boolean;
  schedule: CronSchedule;
  sessionTarget: string;
  payload: {
    kind: string;
    model?: string;
    thinking?: string;
    timeoutSeconds?: number;
    message: string;
  };
  delivery: CronDelivery;
};

// ---------------------------------------------------------------------------
// Manifest — single source of truth
// ---------------------------------------------------------------------------

function displayName(agentId: string): string {
  if (agentId === "builder-mobile") return "Builder Mobile";
  if (agentId === "openclaw-maintainer") return "OpenClaw Maintainer";
  return agentId.charAt(0).toUpperCase() + agentId.slice(1);
}

function specialistSmokePayload(agentId: string, dn: string): string {
  const isMaintainer = agentId === "openclaw-maintainer";
  const scriptPath = isMaintainer
    ? `${WS}/workspace-openclaw-maintainer/scripts/openclaw-maintainer-weekly-smoke.sh`
    : `${WS}/workspace-${agentId}/scripts/specialist-weekly-smoke.sh`;

  const title = isMaintainer
    ? "Run the OpenClaw Maintainer weekly scored smoke test and report results."
    : `Run ${dn} weekly specialist smoke test.`;

  const failMsg = isMaintainer
    ? "Reminder: weekly OpenClaw maintainer smoke failed. Review hook wiring, triage protocol, verification gates, and attribution compliance."
    : `Reminder: ${dn} weekly smoke failed. Review protocol, verification discipline, and attribution guardrails.`;

  return [
    title,
    "",
    "Execute exactly:",
    "set -euo pipefail",
    `OUT="$(${scriptPath} 2>&1)" || RC=$?`,
    "RC=${RC:-0}",
    "printf '%s\\n' \"$OUT\"",
    'if [ "$RC" -ne 0 ]; then',
    `  openclaw system event --text "${failMsg}" --mode now`,
    "  exit 1",
    "fi",
    "exit 0",
  ].join("\n");
}

/** Ordered specialist list with per-agent schedule overrides (cron minute, hour). */
const SPECIALIST_SCHEDULE: ReadonlyArray<{
  id: string;
  minute: number;
  hour: number;
}> = [
  { id: "openclaw-maintainer", minute: 32, hour: 9 },
  { id: "samantha", minute: 2, hour: 10 },
  { id: "sentinel", minute: 4, hour: 10 },
  { id: "shipwright", minute: 6, hour: 10 },
  { id: "caretaker", minute: 8, hour: 10 },
  { id: "archivist", minute: 10, hour: 10 },
  { id: "scout", minute: 12, hour: 10 },
  { id: "operator", minute: 14, hour: 10 },
  { id: "reviewer", minute: 16, hour: 10 },
  { id: "builder-mobile", minute: 18, hour: 10 },
];

function buildManifest(): ManagedJob[] {
  const jobs: ManagedJob[] = [];

  // Agent-bench-wide weekly smoke (system-level, not per-specialist)
  jobs.push({
    name: "healthcheck:agent-bench-weekly-smoke",
    scope: "system",
    schedule: { kind: "cron", expr: "20 9 * * 1", tz: "America/New_York" },
    sessionTarget: "isolated",
    payload: {
      kind: "agentTurn",
      model: "anthropic/claude-opus-4-6",
      thinking: "low",
      timeoutSeconds: 480,
      message:
        'Run the weekly specialist-agent bench smoke test. This is a deterministic health + recency check — not a deep optimization review.\n\n## Agents to check\nsamantha, sentinel, shipwright, caretaker, archivist, scout, operator, reviewer, builder-mobile, openclaw-maintainer\n\n## Required checks (deterministic, per agent)\n\n1. **Config presence**: Run `openclaw config get agents.list` and verify each agent ID exists.\n2. **Workspace files**: For each agent, check that these files exist in `~/.openclaw/workspace-<agentId>/`:\n   - SOUL.md, AGENTS.md, IDENTITY.md\n   - (CLAUDE.md is optional — note if missing but do not fail)\n3. **Model policy compliance**: Verify each agent uses only `anthropic/claude-opus-4-6` or `openai-codex/gpt-5.3-codex` as primary and fallback.\n4. **Recency check**: Run `openclaw cron runs --limit 50 --json 2>/dev/null` and `ls -lt ~/.openclaw/sessions/ 2>/dev/null | head -30` to assess recent agent activity. Flag any specialist with no session activity in the last 7 days as "dormant".\n5. **Cron guard health**: Verify that `healthcheck:agent-bench-daily` exists and its lastRunStatus is "ok" (run `openclaw cron list --json`).\n\n## Output format (concise, structured)\n\n```\n## Weekly Bench Smoke Test — <date>\n\n### Pass/Fail Summary\n| Agent | Config | Files | Model | Recency | Status |\n|-------|--------|-------|-------|---------|--------|\n| samantha | ✅ | ✅ | ✅ | active | PASS |\n| ... | ... | ... | ... | ... | ... |\n\n### Recency & Risk Watchlist\n- <agent>: <risk note or "nominal">\n- ...\n\n### Cron Guard Status\n- healthcheck:agent-bench-daily: <status>\n\n### Overall: <PASS/FAIL> (<N>/<total> agents healthy)\n```\n\n## Model policy (hard constraint)\nUse/recommend only: `anthropic/claude-opus-4-6` and `openai-codex/gpt-5.3-codex`. Do not suggest downgrades.\n\nIf any check cannot complete, report partial results with exact blockers.',
    },
    delivery: {
      mode: "announce",
      channel: "signal",
      to: "+19412897570",
      bestEffort: true,
    },
    enabled: true,
  });

  // Per-specialist smoke jobs
  for (const spec of SPECIALIST_SCHEDULE) {
    const agentId = spec.id;
    const dn = displayName(agentId);

    jobs.push({
      name: `healthcheck:${agentId}-weekly-smoke`,
      scope: "smoke",
      schedule: {
        kind: "cron",
        expr: `${spec.minute} ${spec.hour} * * 1`,
        tz: "America/New_York",
      },
      sessionTarget: "isolated",
      payload: {
        kind: "agentTurn",
        model: "anthropic/claude-opus-4-6",
        thinking: "low",
        timeoutSeconds: 240,
        message: specialistSmokePayload(agentId, dn),
      },
      delivery: {
        mode: "announce",
        channel: "signal",
        to: "+19412897570",
        bestEffort: true,
      },
      enabled: true,
    });
  }

  return jobs;
}

// ---------------------------------------------------------------------------
// Live state
// ---------------------------------------------------------------------------

function loadLiveJobs(): LiveJob[] {
  const raw = runOrThrow(["openclaw", "cron", "list", "--json"], {
    quiet: true,
  });
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed)
    ? parsed
    : (parsed.jobs ?? parsed.entries ?? []);
  return list as LiveJob[];
}

// ---------------------------------------------------------------------------
// Diff engine
// ---------------------------------------------------------------------------

type Action =
  | { kind: "create"; job: ManagedJob }
  | {
      kind: "update";
      jobId: string;
      name: string;
      patches: Record<string, unknown>;
    }
  | { kind: "remove"; jobId: string; name: string };

/** Deep equality ignoring ephemeral/computed fields like staggerMs and key order. */
function deepEqual(a: unknown, b: unknown): boolean {
  return stableStringify(normalize(a)) === stableStringify(normalize(b));
}

function stableStringify(v: unknown): string {
  if (v === null || v === undefined || typeof v !== "object") {
    return JSON.stringify(v);
  }
  if (Array.isArray(v)) {
    return `[${v.map(stableStringify).join(",")}]`;
  }
  const obj = v as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const entries = keys.map(
    (k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`,
  );
  return `{${entries.join(",")}}`;
}

function normalize(v: unknown): unknown {
  if (v === null || v === undefined) return v;
  if (typeof v === "string") {
    // Normalize whitespace: trim trailing whitespace per line, normalize line endings
    return v
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+$/gm, "")
      .trimEnd();
  }
  if (typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map(normalize);
  const obj = v as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    // staggerMs is computed/ephemeral — ignore in comparisons
    if (key === "staggerMs") continue;
    out[key] = normalize(val);
  }
  return out;
}

function diff(manifest: ManagedJob[], live: LiveJob[]): Action[] {
  const actions: Action[] = [];
  const liveByName = new Map<string, LiveJob>();
  for (const j of live) {
    liveByName.set(j.name, j);
  }

  const managedNames = new Set(manifest.map((j) => j.name));

  // Check for creates and updates
  for (const want of manifest) {
    const have = liveByName.get(want.name);
    if (!have) {
      actions.push({ kind: "create", job: want });
      continue;
    }

    const patches: Record<string, unknown> = {};

    if (!deepEqual(have.schedule, want.schedule)) {
      patches.schedule = want.schedule;
    }
    if (have.sessionTarget !== want.sessionTarget) {
      patches.sessionTarget = want.sessionTarget;
    }
    if (!deepEqual(have.payload, want.payload)) {
      patches.payload = want.payload;
    }
    if (!deepEqual(have.delivery, want.delivery)) {
      patches.delivery = want.delivery;
    }
    if (have.enabled !== want.enabled) {
      patches.enabled = want.enabled;
    }

    if (Object.keys(patches).length > 0) {
      actions.push({
        kind: "update",
        jobId: have.id,
        name: want.name,
        patches,
      });
    }
  }

  // Check for orphaned managed jobs (live jobs whose names match manifest naming
  // patterns but are NOT in the current manifest scope). Only flag names that look
  // like they belong to the filtered manifest — don't touch unrelated jobs.
  const _manifestPrefixes = new Set(
    manifest.map(
      (j) => `${j.name.split(":")[0]}:${j.name.split(":")[1]?.split("-")[0]}`,
    ),
  );
  for (const [name, lj] of liveByName) {
    if (!managedNames.has(name)) {
      // Only orphan-flag names that share a prefix with a manifest job AND contain
      // the specialist pattern. This avoids flagging system-scope jobs when running
      // in smoke scope.
      const isSpecialistSmoke =
        name.startsWith("healthcheck:") &&
        name.endsWith("-weekly-smoke") &&
        name !== "healthcheck:agent-bench-weekly-smoke";
      const isSystemSmoke = name === "healthcheck:agent-bench-weekly-smoke";

      const shouldFlag =
        manifest.some((m) => m.scope === "smoke") && isSpecialistSmoke
          ? true
          : manifest.some((m) => m.scope === "system") && isSystemSmoke;

      if (shouldFlag) {
        actions.push({ kind: "remove", jobId: lj.id, name });
      }
    }
  }

  return actions;
}

// ---------------------------------------------------------------------------
// Apply
// ---------------------------------------------------------------------------

function applyCreate(job: ManagedJob): void {
  const args = [
    "openclaw",
    "cron",
    "add",
    "--name",
    job.name,
    "--session",
    job.sessionTarget,
  ];

  if (job.schedule.kind === "cron") {
    args.push("--cron", job.schedule.expr, "--tz", job.schedule.tz);
  }

  if (job.payload.kind === "agentTurn") {
    args.push("--message", job.payload.message);
    if (job.payload.model) args.push("--model", job.payload.model);
    if (job.payload.thinking) args.push("--thinking", job.payload.thinking);
    if (job.payload.timeoutSeconds) {
      args.push("--timeout-seconds", String(job.payload.timeoutSeconds));
    }
  } else {
    args.push("--system-event", job.payload.message);
  }

  if (job.delivery.mode === "announce") {
    args.push("--announce");
    if (job.delivery.channel) args.push("--channel", job.delivery.channel);
    if (job.delivery.to) args.push("--to", job.delivery.to);
    if (job.delivery.bestEffort) args.push("--best-effort-deliver");
  }

  if (!job.enabled) args.push("--disable");

  runOrThrow(args);
}

function applyUpdate(jobId: string, patches: Record<string, unknown>): void {
  const args = ["openclaw", "cron", "edit", jobId];

  if (patches.schedule) {
    const s = patches.schedule as CronSchedule;
    if (s.kind === "cron") {
      args.push("--cron", s.expr, "--tz", s.tz);
    }
  }

  if (patches.sessionTarget) {
    args.push("--session", patches.sessionTarget as string);
  }

  if (patches.payload) {
    const p = patches.payload as ManagedJob["payload"];
    if (p.kind === "agentTurn") {
      args.push("--message", p.message);
      if (p.model) args.push("--model", p.model);
      if (p.thinking) args.push("--thinking", p.thinking);
      if (p.timeoutSeconds) {
        args.push("--timeout-seconds", String(p.timeoutSeconds));
      }
    } else {
      args.push("--system-event", p.message);
    }
  }

  if (patches.delivery) {
    const d = patches.delivery as CronDelivery;
    if (d.mode === "announce") {
      args.push("--announce");
      if (d.channel) args.push("--channel", d.channel);
      if (d.to) args.push("--to", d.to);
      if (d.bestEffort) args.push("--best-effort-deliver");
    } else {
      args.push("--no-deliver");
    }
  }

  if (patches.enabled === true) args.push("--enable");
  if (patches.enabled === false) args.push("--disable");

  runOrThrow(args);
}

function applyActions(actions: Action[]): void {
  for (const a of actions) {
    switch (a.kind) {
      case "create": {
        applyCreate(a.job);
        console.log(`  [CREATED] ${a.job.name}`);
        break;
      }
      case "update": {
        applyUpdate(a.jobId, a.patches);
        console.log(
          `  [UPDATED] ${a.name} (${Object.keys(a.patches).join(", ")})`,
        );
        break;
      }
      case "remove": {
        runOrThrow(["openclaw", "cron", "rm", a.jobId]);
        console.log(`  [REMOVED] ${a.name}`);
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

export function reconcileCron(): void {
  const apply = Bun.argv.includes("--apply");
  const scopeArg = Bun.argv.find((a) => a.startsWith("--scope="));
  const scope = scopeArg ? scopeArg.split("=")[1] : "smoke";

  logStep("Loading cron manifest");
  let manifest = buildManifest();

  if (scope === "smoke") {
    manifest = manifest.filter((j) => j.scope === "smoke");
    console.log(`  scope: smoke (${manifest.length} specialist smoke jobs)`);
  } else {
    console.log(`  scope: all (${manifest.length} managed jobs)`);
  }

  logStep("Loading live cron state");
  const live = loadLiveJobs();
  console.log(`  live jobs total: ${live.length}`);

  logStep("Computing diff");
  const actions = diff(manifest, live);

  if (actions.length === 0) {
    console.log("  ✅ No drift detected — manifest and live state match.");
    return;
  }

  console.log(`  ${actions.length} action(s) needed:`);
  for (const a of actions) {
    switch (a.kind) {
      case "create":
        console.log(`    + CREATE ${a.job.name}`);
        break;
      case "update":
        console.log(
          `    ~ UPDATE ${a.name} (${Object.keys(a.patches).join(", ")})`,
        );
        break;
      case "remove":
        console.log(`    - REMOVE ${a.name}`);
        break;
    }
  }

  if (!apply) {
    console.log("\n  Dry run. Pass --apply to converge live state.");
    return;
  }

  logStep("Applying changes");
  applyActions(actions);

  logStep("Reconciliation complete");
}
