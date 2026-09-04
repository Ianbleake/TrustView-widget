import { describe, expect, it } from "vitest";
import { getTextStyleClasses } from "./getTextStyleClasses";

const NO_STYLE: TextStyle = { bold: false, italic: false, underline: false };

describe("getTextStyleClasses", () => {
  it("returns an empty string when no style flag is enabled", () => {
    expect(getTextStyleClasses(NO_STYLE)).toBe("");
  });

  it.each([
    ["bold", "font-bold"],
    ["italic", "italic"],
    ["underline", "underline"],
  ] as const)("maps the %s flag to '%s'", (flag, expected) => {
    expect(getTextStyleClasses({ ...NO_STYLE, [flag]: true })).toBe(expected);
  });

  it("combines every enabled flag in declaration order", () => {
    expect(getTextStyleClasses({ bold: true, italic: true, underline: true })).toBe(
      "font-bold italic underline"
    );
  });

  it("keeps the class order stable regardless of the object key order", () => {
    expect(getTextStyleClasses({ underline: true, bold: true, italic: false })).toBe(
      "font-bold underline"
    );
  });
});
