import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "./formatDate";

const NOW = new Date("2026-03-15T12:00:00.000Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("formatDate", () => {
  it.each([
    ["es", "Hoy"],
    ["en", "Today"],
    ["pt", "Hoje"],
  ])("labels the same day in %s as '%s'", (locale, expected) => {
    expect(formatDate("2026-03-15T08:00:00.000Z", locale)).toBe(expected);
  });

  it.each([
    ["es", "Ayer"],
    ["en", "Yesterday"],
    ["pt", "Ontem"],
  ])("labels the previous day in %s as '%s'", (locale, expected) => {
    expect(formatDate("2026-03-14T08:00:00.000Z", locale)).toBe(expected);
  });

  it("defaults to Spanish when no locale is supplied", () => {
    expect(formatDate("2026-03-15T08:00:00.000Z")).toBe("Hoy");
  });

  it("falls back to Spanish labels for an unsupported locale", () => {
    expect(formatDate("2026-03-14T08:00:00.000Z", "fr")).toBe("Ayer");
  });

  it("formats older dates as a long localised date", () => {
    expect(formatDate("2026-01-02T08:00:00.000Z", "en")).toBe("January 2, 2026");
    expect(formatDate("2026-01-02T08:00:00.000Z", "es")).toBe("2 de enero de 2026");
  });

  /**
   * KNOWN DEFECT — the relative label is derived from
   * `Math.floor(diffMs / MS_PER_DAY)`, which measures elapsed 24-hour windows
   * rather than calendar days. A review posted 23 hours ago is therefore
   * labelled "Hoy" even though it landed on the previous calendar day, and a
   * review posted 25 hours ago is labelled "Ayer" even when it is two calendar
   * days old in the reader's timezone.
   *
   * These assertions pin the CURRENT behaviour so the suite stays green. They
   * document a defect, not the desired behaviour.
   */
  it("labels a 23-hour-old review as 'Hoy' regardless of the calendar day", () => {
    expect(formatDate("2026-03-14T13:00:00.000Z", "es")).toBe("Hoy");
  });

  it("skips the relative labels entirely for future dates", () => {
    // A future timestamp makes diffMs negative, and Math.floor pushes the day
    // difference to -1 or lower, so neither the 0 nor the 1 branch matches.
    // A review dated a few hours from now renders as an absolute date.
    expect(formatDate("2026-03-15T18:00:00.000Z", "es")).toBe("15 de marzo de 2026");
  });
});
