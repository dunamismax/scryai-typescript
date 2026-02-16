import { describe, expect, test } from "bun:test";

import { safeRedirectPath } from "~/lib/auth-utils.server";

describe("safeRedirectPath", () => {
  test("keeps internal routes", () => {
    expect(safeRedirectPath("/dashboard")).toBe("/dashboard");
  });

  test("blocks external paths", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/dashboard");
  });
});
