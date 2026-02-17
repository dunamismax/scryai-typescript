import { hasEnv, isGitRepo, logStep, runOrThrow } from "../common";
import { MANAGED_PROJECTS } from "../projects.config";

const optional = hasEnv("OPTIONAL");

function requireProjectRepo(name: string, path: string): void {
  if (isGitRepo(path)) {
    return;
  }

  const message = `missing: ${name} (${path})`;
  if (optional) {
    console.log(`skip: ${message}`);
    return;
  }

  throw new Error(message);
}

export function listProjects(): void {
  logStep("Managed projects");
  if (MANAGED_PROJECTS.length === 0) {
    console.log("(none configured)");
    return;
  }

  for (const project of MANAGED_PROJECTS) {
    console.log(`${project.name}: ${project.path}`);
  }
}

export function installProjects(): void {
  logStep("Install managed project dependencies");
  if (MANAGED_PROJECTS.length === 0) {
    console.log("(none configured)");
    return;
  }

  for (const project of MANAGED_PROJECTS) {
    if (!isGitRepo(project.path)) {
      requireProjectRepo(project.name, project.path);
      continue;
    }

    console.log(`project: ${project.name}`);
    runOrThrow(project.installCommand, { cwd: project.path });
  }
}

export function verifyProjects(): void {
  logStep("Run managed project verification");
  if (MANAGED_PROJECTS.length === 0) {
    console.log("(none configured)");
    return;
  }

  for (const project of MANAGED_PROJECTS) {
    if (!isGitRepo(project.path)) {
      requireProjectRepo(project.name, project.path);
      continue;
    }

    console.log(`project: ${project.name}`);
    for (const command of project.verifyCommands) {
      runOrThrow(command, { cwd: project.path });
    }
  }
}

export function doctorProjects(): void {
  logStep("Managed project health");
  if (MANAGED_PROJECTS.length === 0) {
    console.log("(none configured)");
    return;
  }

  for (const project of MANAGED_PROJECTS) {
    const present = isGitRepo(project.path);
    console.log(
      `${project.name}: ${present ? "ok" : "missing"} (${project.path})`,
    );
    if (!present) {
      continue;
    }

    const branch = runOrThrow(["git", "branch", "--show-current"], {
      cwd: project.path,
      quiet: true,
    });

    const pushUrls = runOrThrow(
      ["git", "remote", "get-url", "--all", "--push", "origin"],
      {
        cwd: project.path,
        quiet: true,
      },
    );

    const urls = pushUrls
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join(" | ");

    console.log(`branch: ${branch}`);
    console.log(`push: ${urls}`);
  }
}
