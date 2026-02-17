import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setupStorage } from "../../scripts/tasks/setup-storage";

const touched: string[] = [];

afterEach(() => {
  for (const dir of touched.splice(0, touched.length)) {
    rmSync(dir, { force: true, recursive: true });
  }
  delete process.env.SCRY_INFRA_ENV_EXAMPLE;
  delete process.env.SCRY_INFRA_ENV_FILE;
});

describe("setupStorage", () => {
  test("adds missing keys from env example", () => {
    const dir = mkdtempSync(join(tmpdir(), "scry-storage-test-"));
    touched.push(dir);

    const envExample = join(dir, ".env.example");
    const envFile = join(dir, ".env");

    writeFileSync(envExample, "A=1\nB=2\nC=3\n");
    writeFileSync(envFile, "A=7\n\n# keep this comment\n");

    process.env.SCRY_INFRA_ENV_EXAMPLE = envExample;
    process.env.SCRY_INFRA_ENV_FILE = envFile;

    setupStorage();

    const content = readFileSync(envFile, "utf8");
    expect(content).toContain("A=7\n");
    expect(content).toContain("B=2\n");
    expect(content).toContain("C=3\n");
  });
});
