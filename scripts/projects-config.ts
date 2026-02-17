import { resolve } from "node:path";

export type ManagedProject = {
  installCommand: string[];
  name: string;
  path: string;
  verifyCommands: string[][];
};

const home = process.env.HOME ?? "/home/sawyer";
const githubRoot = process.env.GITHUB_ROOT
  ? resolve(process.env.GITHUB_ROOT)
  : resolve(home, "github");

export const managedProjects: ManagedProject[] = [
  {
    installCommand: ["bun", "install"],
    name: "astro-web-template",
    path: resolve(githubRoot, "astro-web-template"),
    verifyCommands: [["bun", "run", "build"]],
  },
  {
    installCommand: ["bun", "install"],
    name: "astro-blog-template",
    path: resolve(githubRoot, "astro-blog-template"),
    verifyCommands: [
      ["bun", "run", "lint"],
      ["bun", "run", "typecheck"],
      ["bun", "run", "build"],
    ],
  },
];
