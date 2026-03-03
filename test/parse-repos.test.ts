import { describe, expect, test } from "bun:test";
import { parseReposFromIndex } from "../scripts/tasks/setup-workstation";

describe("parseReposFromIndex", () => {
  test("parses repos from ## Repositories section", () => {
    const markdown = `# Profile

## Repositories

### grimoire

Description here.

### homepage

Another description.

## Other Section

### not-a-repo
`;
    const repos = parseReposFromIndex(markdown);
    expect(repos).toEqual(["grimoire", "homepage"]);
  });

  test("returns empty for no Repositories section", () => {
    const markdown = `# Profile

## About

Some text here.
`;
    expect(parseReposFromIndex(markdown)).toEqual([]);
  });

  test("returns empty for empty input", () => {
    expect(parseReposFromIndex("")).toEqual([]);
  });

  test("handles repos with dots and hyphens", () => {
    const markdown = `## Repositories

### my-project.v2

### hello_world
`;
    const repos = parseReposFromIndex(markdown);
    expect(repos).toContain("my-project.v2");
    expect(repos).toContain("hello_world");
  });

  test("deduplicates repo names", () => {
    const markdown = `## Repositories

### grimoire

### grimoire
`;
    const repos = parseReposFromIndex(markdown);
    expect(repos).toEqual(["grimoire"]);
  });

  test("ignores lines that are not ### headings", () => {
    const markdown = `## Repositories

### valid-repo

Some description text.

- bullet point

### another-repo
`;
    const repos = parseReposFromIndex(markdown);
    expect(repos).toEqual(["valid-repo", "another-repo"]);
  });
});
