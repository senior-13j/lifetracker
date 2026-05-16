import { describe, expect, it } from "vitest";

import { createLifeEvent, signAccessToken, verifyToken } from "./index.js";

describe("backend common", () => {
  it("signs and verifies access tokens", () => {
    process.env.JWT_SECRET = "test-secret";
    const token = signAccessToken({ id: "u1", email: "a@b.com", name: "Alex" });

    expect(verifyToken(token)).toEqual({ id: "u1", email: "a@b.com", name: "Alex" });
  });

  it("creates valid domain events", () => {
    const event = createLifeEvent({
      type: "habit.created",
      actorId: "u1",
      payload: { habitId: "h1" }
    });

    expect(event.id).toMatch(/^evt_/);
    expect(event.type).toBe("habit.created");
  });
});
