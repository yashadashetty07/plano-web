import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges conflicting Tailwind utilities", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});
