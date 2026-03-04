import { homedir } from "node:os";
import { join } from "node:path";
import type { ManagedProject } from "./common";

const GITHUB = join(homedir(), "github");

export const MANAGED_PROJECTS: ManagedProject[] = [
  // --- TypeScript Web Apps ---
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
  // --- CI Pipeline ---
  {
    name: "pr-firefighter",
    path: join(GITHUB, "pr-firefighter"),
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
  // --- Content ---
  {
    name: "Sawyer-Visual-Media",
    path: join(GITHUB, "Sawyer-Visual-Media"),
    installCommand: ["bun", "install"],
    verifyCommands: [],
  },
  // --- Python ---
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
