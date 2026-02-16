import { describe, expect, test } from "bun:test";

import { hasPermission } from "~/lib/rbac";

describe("rbac", () => {
  test("member cannot manage users", () => {
    expect(hasPermission("member", "manage_users")).toBe(false);
  });

  test("admin can manage system", () => {
    expect(hasPermission("admin", "manage_system")).toBe(true);
  });
});
