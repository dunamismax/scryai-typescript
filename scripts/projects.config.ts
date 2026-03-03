import { homedir } from "node:os";
import { join } from "node:path";
import type { ManagedProject } from "./common";

const GITHUB = join(homedir(), "github");

export const MANAGED_PROJECTS: ManagedProject[] = [
  // --- TypeScript Web Apps ---
  {
    name: "questlog",
    path: join(GITHUB, "questlog"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  {
    name: "podwatch",
    path: join(GITHUB, "podwatch"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  {
    name: "homepage",
    path: join(GITHUB, "homepage"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  {
    name: "sentinel",
    path: join(GITHUB, "sentinel"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  {
    name: "rip",
    path: join(GITHUB, "rip"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  // --- Chess Platform ---
  {
    name: "elchess",
    path: join(GITHUB, "elchess"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  // --- Mobile ---
  {
    name: "CallRift",
    path: join(GITHUB, "CallRift"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  // --- Ops CLI ---
  {
    name: "grimoire",
    path: join(GITHUB, "grimoire"),
    installCommand: ["bun", "install"],
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
    ],
  },
  // --- Python ---
  {
    name: "oracle",
    path: join(GITHUB, "oracle"),
    installCommand: ["uv", "sync"],
    verifyCommands: [
      ["uv", "run", "ruff", "check", "."],
      ["uv", "run", "mypy", "."],
    ],
  },
  {
    name: "augur",
    path: join(GITHUB, "augur"),
    installCommand: ["uv", "sync"],
    verifyCommands: [
      ["uv", "run", "ruff", "check", "."],
      ["uv", "run", "mypy", "."],
    ],
  },
];
