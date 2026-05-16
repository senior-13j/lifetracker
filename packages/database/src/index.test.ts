import { describe, expect, it } from "vitest";

import { objectIdToString } from "./index.js";

describe("database helpers", () => {
  it("serializes object ids consistently", () => {
    expect(objectIdToString("abc")).toBe("abc");
  });
});
