import { homedir } from "node:os";
import { join } from "node:path";
import type { ManagedProject } from "./common";

export const GITHUB_ROOT = process.env.GITHUB_ROOT ?? join(homedir(), "github");

export const MANAGED_PROJECTS: ManagedProject[] = [];
