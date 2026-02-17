import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type ManagedProject = {
  name: string;
  path: string;
  installCommand: string[];
  verifyCommands: string[][];
};

type RunOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  quiet?: boolean;
};

export function logStep(message: string): void {
  console.log(`\n==> ${message}`);
}

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

export function ensureParentDir(path: string): void {
  ensureDir(dirname(path));
}

export function runOrThrow(
  command: string[],
  options: RunOptions = {},
): string {
  if (!options.quiet) {
    console.log(`$ ${command.join(" ")}`);
  }

  const result = Bun.spawnSync({
    cmd: command,
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = Buffer.from(result.stdout).toString("utf8").trim();
  const stderr = Buffer.from(result.stderr).toString("utf8").trim();

  if (result.exitCode !== 0) {
    if (stdout.length > 0) {
      console.error(stdout);
    }
    if (stderr.length > 0) {
      console.error(stderr);
    }
    throw new Error(
      `Command failed (${result.exitCode}): ${command.join(" ")}`,
    );
  }

  return stdout;
}

export function commandExists(binary: string): boolean {
  const result = Bun.spawnSync({
    cmd: ["bash", "-lc", `command -v ${binary} >/dev/null 2>&1`],
    stdout: "ignore",
    stderr: "ignore",
  });
  return result.exitCode === 0;
}

export function hasEnv(name: string): boolean {
  return Object.hasOwn(process.env, name);
}

export function fail(message: string): never {
  throw new Error(message);
}

export function isGitRepo(path: string): boolean {
  return existsSync(path) && existsSync(`${path}/.git`);
}
