import { describe, expect, test } from "bun:test";
import { isCorrect } from "../scripts/tasks/sync-remotes";

describe("isCorrect", () => {
  const expected = {
    ghUrl: "git@github.com-dunamismax:dunamismax/grimoire.git",
    cbUrl: "git@codeberg.org-dunamismax:dunamismax/grimoire.git",
  };

  test("returns true for correct dual-push config", () => {
    const urls = {
      fetchUrl: "git@github.com-dunamismax:dunamismax/grimoire.git",
      pushUrls: [
        "git@github.com-dunamismax:dunamismax/grimoire.git",
        "git@codeberg.org-dunamismax:dunamismax/grimoire.git",
      ],
    };
    expect(isCorrect(urls, expected)).toBe(true);
  });

  test("returns false when fetch URL is wrong", () => {
    const urls = {
      fetchUrl: "git@github.com:dunamismax/grimoire.git",
      pushUrls: [
        "git@github.com-dunamismax:dunamismax/grimoire.git",
        "git@codeberg.org-dunamismax:dunamismax/grimoire.git",
      ],
    };
    expect(isCorrect(urls, expected)).toBe(false);
  });

  test("returns false with only one push URL", () => {
    const urls = {
      fetchUrl: "git@github.com-dunamismax:dunamismax/grimoire.git",
      pushUrls: ["git@github.com-dunamismax:dunamismax/grimoire.git"],
    };
    expect(isCorrect(urls, expected)).toBe(false);
  });

  test("returns false with push URLs in wrong order", () => {
    const urls = {
      fetchUrl: "git@github.com-dunamismax:dunamismax/grimoire.git",
      pushUrls: [
        "git@codeberg.org-dunamismax:dunamismax/grimoire.git",
        "git@github.com-dunamismax:dunamismax/grimoire.git",
      ],
    };
    expect(isCorrect(urls, expected)).toBe(false);
  });

  test("returns false with three push URLs", () => {
    const urls = {
      fetchUrl: "git@github.com-dunamismax:dunamismax/grimoire.git",
      pushUrls: [
        "git@github.com-dunamismax:dunamismax/grimoire.git",
        "git@codeberg.org-dunamismax:dunamismax/grimoire.git",
        "git@extra.com:dunamismax/grimoire.git",
      ],
    };
    expect(isCorrect(urls, expected)).toBe(false);
  });

  test("returns false with empty push URLs", () => {
    const urls = {
      fetchUrl: "git@github.com-dunamismax:dunamismax/grimoire.git",
      pushUrls: [],
    };
    expect(isCorrect(urls, expected)).toBe(false);
  });
});
