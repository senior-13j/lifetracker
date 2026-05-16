import { describe, expect, it } from "vitest";

import { createHabitSchema, lifeEventSchema, registerSchema } from "./index.js";

describe("shared contracts", () => {
  it("normalizes user registration input", () => {
    const parsed = registerSchema.parse({
      name: "Alex",
      email: "ALEX@EXAMPLE.COM",
      password: "demo1234",
      timezone: "Europe/Belgrade"
    });

    expect(parsed.email).toBe("alex@example.com");
  });

  it("rejects weak habits and invalid colors", () => {
    expect(() =>
      createHabitSchema.parse({
        name: "A",
        category: "fitness",
        color: "green",
        targetPerWeek: 9
      })
    ).toThrow();
  });

  it("validates a Kafka domain event", () => {
    expect(
      lifeEventSchema.parse({
        id: "evt_1",
        type: "habit.completed",
        actorId: "user_1",
        timestamp: new Date().toISOString(),
        payload: { habitId: "habit_1" }
      }).type
    ).toBe("habit.completed");
  });
});
