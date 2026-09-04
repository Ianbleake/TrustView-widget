import { describe, expect, it } from "vitest";
import { merge } from "./mergeStyles";

describe("merge", () => {
  it("returns an empty string when every input is falsy", () => {
    expect(merge(false, null, undefined, "")).toBe("");
  });

  it("lets the last conflicting Tailwind utility win", () => {
    expect(merge("text-sm", "text-lg")).toBe("text-lg");
  });

  it("preserves non-conflicting utilities", () => {
    expect(merge("font-bold", "italic", "underline")).toBe("font-bold italic underline");
  });

  it("keeps arbitrary colour values coming from the widget config", () => {
    expect(merge("text-[#111827]", "bg-[#ffffff]")).toBe("text-[#111827] bg-[#ffffff]");
  });

  it("resolves an arbitrary value against a named utility of the same group", () => {
    expect(merge("text-red-500", "text-[#111827]")).toBe("text-[#111827]");
  });
});
