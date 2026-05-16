import { describe, expect, it } from "vitest";

import { handler } from "./handler.js";

describe("daily summary lambda", () => {
  it("decodes Kafka event-source records", async () => {
    const payload = Buffer.from(
      JSON.stringify({
        id: "evt_1",
        type: "habit.completed",
        actorId: "user_1",
        timestamp: new Date().toISOString(),
        payload: { habitId: "habit_1", streak: 7 }
      })
    ).toString("base64");

    await expect(
      handler({
        eventSource: "SelfManagedKafka",
        records: {
          "life.events-0": [
            {
              topic: "life.events",
              partition: 0,
              offset: 1,
              timestamp: Date.now(),
              value: payload
            }
          ]
        }
      })
    ).resolves.toEqual({
      processed: 1,
      habitCompletions: 1,
      achievements: 0,
      users: ["user_1"]
    });
  });
});
