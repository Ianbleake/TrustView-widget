import { describe, expect, it } from "vitest";
import { t } from "./translations";

const SUPPORTED_LOCALES = ["es", "en", "pt"] as const;

const TRANSLATED_KEYS = [
  "leaveReview",
  "reviews",
  "name",
  "yourReview",
  "rateProduct",
  "send",
  "sending",
  "thankYou",
  "reviewSent",
  "error",
  "product",
  "noReviews",
  "loadMore",
  "today",
  "yesterday",
  "nameRequired",
  "reviewRequired",
  "namePlaceholder",
  "reviewPlaceholder",
  "modalTitle",
  "submit",
  "retry",
  "widgetError",
] as const;

describe("t", () => {
  it.each([
    ["es", "Reseñas"],
    ["en", "Reviews"],
    ["pt", "Avaliações"],
  ] as const)("returns the %s translation for a supported locale", (locale, expected) => {
    expect(t(locale, "reviews")).toBe(expected);
  });

  it("falls back to Spanish for an unsupported locale", () => {
    expect(t("fr", "reviews")).toBe("Reseñas");
  });

  it("falls back to Spanish for an empty locale", () => {
    expect(t("", "reviews")).toBe("Reseñas");
  });

  it("does not resolve locales case-insensitively, so callers must normalise", () => {
    expect(t("EN", "reviews")).toBe("Reseñas");
  });

  it.each(SUPPORTED_LOCALES)("defines every key for the %s locale", (locale) => {
    const missing = TRANSLATED_KEYS.filter((key) => {
      const value = t(locale, key);
      return typeof value !== "string" || value.length === 0;
    });

    expect(missing).toEqual([]);
  });

  it("keeps the locales in sync — no locale is a subset of another", () => {
    for (const key of TRANSLATED_KEYS) {
      const values = SUPPORTED_LOCALES.map((locale) => t(locale, key));
      expect(values.every((value) => typeof value === "string")).toBe(true);
    }
  });

  /**
   * KNOWN DEFECT — UNTRACKED, needs a task code.
   *
   * The locale guard is `locale in translations`, and the `in` operator walks
   * the prototype chain. Any Object.prototype member name therefore passes the
   * guard, `translations[locale]` resolves to an inherited value instead of a
   * translation table, and `t` returns `undefined` rather than falling back to
   * Spanish. The widget reads `locale` from the host page's embed attributes,
   * so this input is attacker-influenced.
   *
   * The fix is to check `Object.hasOwn(translations, locale)`. Until then the
   * assertions below pin the CURRENT behaviour so the suite stays green. They
   * document a defect, not the desired behaviour.
   */
  it.each(["constructor", "toString", "valueOf", "__proto__"])(
    "returns undefined instead of the Spanish fallback for the prototype key %j",
    (locale) => {
      expect(t(locale, "reviews")).toBeUndefined();
    }
  );
});
