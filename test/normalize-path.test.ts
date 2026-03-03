import { describe, expect, test } from "bun:test";
import {
  buildConfigPathSet,
  normalizeHomeRelativePath,
  parsePathList,
} from "../scripts/tasks/setup-config-backup";

describe("normalizeHomeRelativePath", () => {
  const home = "/Users/testuser";

  test("strips ~/ prefix", () => {
    expect(normalizeHomeRelativePath(home, "~/Documents")).toBe("Documents");
  });

  test("strips ./ prefix", () => {
    expect(normalizeHomeRelativePath(home, "./.ssh")).toBe(".ssh");
  });

  test("passes through bare relative path", () => {
    expect(normalizeHomeRelativePath(home, ".gitconfig")).toBe(".gitconfig");
  });

  test("handles nested paths", () => {
    expect(normalizeHomeRelativePath(home, ".openclaw/credentials")).toBe(
      ".openclaw/credentials",
    );
  });

  test("rejects path traversal with ..", () => {
    expect(() => normalizeHomeRelativePath(home, "../etc/passwd")).toThrow(
      "Invalid config backup path",
    );
  });

  test("rejects ~/../../ escape", () => {
    expect(() => normalizeHomeRelativePath(home, "~/../../etc/shadow")).toThrow(
      "Invalid config backup path",
    );
  });

  test("rejects empty string", () => {
    expect(() => normalizeHomeRelativePath(home, "")).toThrow(
      "Invalid config backup path",
    );
  });

  test("rejects whitespace-only string", () => {
    expect(() => normalizeHomeRelativePath(home, "   ")).toThrow(
      "Invalid config backup path",
    );
  });

  test("rejects null byte in path", () => {
    expect(() => normalizeHomeRelativePath(home, "valid\0injection")).toThrow(
      "Invalid config backup path",
    );
  });

  test("rejects path resolving to home root", () => {
    expect(() => normalizeHomeRelativePath(home, "~/")).toThrow(
      "Invalid config backup path",
    );
  });

  test("handles path with spaces", () => {
    expect(
      normalizeHomeRelativePath(home, "Library/Application Support/Code"),
    ).toBe("Library/Application Support/Code");
  });
});

describe("parsePathList", () => {
  test("splits on commas", () => {
    expect(parsePathList("a,b,c")).toEqual(["a", "b", "c"]);
  });

  test("splits on newlines", () => {
    expect(parsePathList("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  test("trims whitespace", () => {
    expect(parsePathList(" a , b , c ")).toEqual(["a", "b", "c"]);
  });

  test("filters empty entries", () => {
    expect(parsePathList("a,,b,")).toEqual(["a", "b"]);
  });

  test("returns empty for empty input", () => {
    expect(parsePathList("")).toEqual([]);
  });
});

describe("buildConfigPathSet", () => {
  test("separates existing and missing paths", () => {
    // /tmp always exists, /nonexistent does not
    const result = buildConfigPathSet("/tmp");
    expect(result.requestedPaths.length).toBeGreaterThan(0);
    // At least some will be missing (e.g., .ssh in /tmp)
    expect(result.missingPaths.length).toBeGreaterThan(0);
  });
});
