import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { logStep, runOrThrow } from "./lib";
import { type ManagedProject, managedProjects } from "./projects-config";

type Command = "doctor" | "install" | "list" | "verify";

function parseCommand(value: string | undefined): Command {
  if (value === undefined || value === "list") {
    return "list";
  }
  if (value === "install" || value === "verify" || value === "doctor") {
    return value;
  }
  throw new Error(`Unknown command: ${value}`);
}

function isProjectRepo(project: ManagedProject): boolean {
  return existsSync(project.path) && existsSync(resolve(project.path, ".git"));
}

function ensureProject(project: ManagedProject, optional: boolean): boolean {
  if (isProjectRepo(project)) {
    return true;
  }

  const message = `missing: ${project.name} (${project.path})`;
  if (optional) {
    console.log(`skip: ${message}`);
    return false;
  }

  throw new Error(message);
}

function listProjects(): void {
  logStep("Managed projects");
  for (const project of managedProjects) {
    console.log(`${project.name}: ${project.path}`);
  }
}

function installProjects(optional: boolean): void {
  logStep("Install managed project dependencies");
  for (const project of managedProjects) {
    if (!ensureProject(project, optional)) {
      continue;
    }
    if (!existsSync(resolve(project.path, "package.json"))) {
      console.log(`skip: ${project.name} has no package.json`);
      continue;
    }
    console.log(`project: ${project.name}`);
    runOrThrow(project.installCommand, { cwd: project.path });
  }
}

function verifyProjects(optional: boolean): void {
  logStep("Run managed project verification");
  for (const project of managedProjects) {
    if (!ensureProject(project, optional)) {
      continue;
    }
    console.log(`project: ${project.name}`);
    for (const command of project.verifyCommands) {
      runOrThrow(command, { cwd: project.path });
    }
  }
}

function doctorProjects(): void {
  logStep("Managed project health");
  for (const project of managedProjects) {
    const present = isProjectRepo(project);
    console.log(`${project.name}: ${present ? "ok" : "missing"} (${project.path})`);

    if (!present) {
      continue;
    }

    const branch = runOrThrow(["git", "-C", project.path, "branch", "--show-current"], {
      quiet: true,
    });
    const pushUrls = runOrThrow(
      ["git", "-C", project.path, "remote", "get-url", "--all", "--push", "origin"],
      { quiet: true },
    )
      .split("\n")
      .filter(Boolean)
      .join(" | ");

    console.log(`branch: ${branch}`);
    console.log(`push: ${pushUrls}`);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const positional = args.filter((value) => !value.startsWith("--"));
  const command = parseCommand(positional[0]);
  const optional = args.includes("--optional");

  switch (command) {
    case "list":
      listProjects();
      return;
    case "install":
      installProjects(optional);
      return;
    case "verify":
      verifyProjects(optional);
      return;
    case "doctor":
      doctorProjects();
      return;
    default:
      throw new Error(`Unsupported command: ${command}`);
  }
}

main();
