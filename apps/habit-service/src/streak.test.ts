import { describe, expect, it } from "vitest";

import { nextStreak } from "./streak.js";

describe("nextStreak", () => {
  it("starts a streak for first completion", () => {
    expect(nextStreak(null, new Date("2026-05-16T10:00:00Z"), 0)).toBe(1);
  });

  it("keeps the same streak for duplicate same-day completion", () => {
    expect(
      nextStreak(new Date("2026-05-16T08:00:00Z"), new Date("2026-05-16T10:00:00Z"), 4)
    ).toBe(4);
  });

  it("increments when the previous completion was yesterday", () => {
    expect(
      nextStreak(new Date("2026-05-15T08:00:00Z"), new Date("2026-05-16T10:00:00Z"), 4)
    ).toBe(5);
  });
});
