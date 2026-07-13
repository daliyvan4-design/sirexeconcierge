import { describe, it, expect } from "vitest";
import { cn, fmt, RATE, SYM } from "@/lib/utils";

describe("cn (className merge)", () => {
  it("merges multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind conflicts", () => {
    expect(cn("px-4", "px-8")).toBe("px-8");
  });
});

describe("RATE", () => {
  it("has XOF at 1:1", () => {
    expect(RATE.XOF).toBe(1);
  });

  it("has EUR conversion rate", () => {
    expect(RATE.EUR).toBeCloseTo(1 / 655.957, 6);
  });

  it("has USD conversion rate", () => {
    expect(RATE.USD).toBeCloseTo(1 / 600, 6);
  });
});

describe("SYM", () => {
  it("returns correct currency symbols", () => {
    expect(SYM.XOF).toBe("XOF");
    expect(SYM.EUR).toBe("€");
    expect(SYM.USD).toBe("$");
  });
});

describe("fmt (currency formatting)", () => {
  it("formats XOF amounts", () => {
    const result = fmt(50000, "XOF");
    expect(result).toContain("50");
    expect(result).toContain("XOF");
  });

  it("formats EUR amounts", () => {
    const result = fmt(655957, "EUR");
    expect(result).toContain("€");
  });

  it("formats USD amounts", () => {
    const result = fmt(600000, "USD");
    expect(result).toContain("$");
  });

  it("defaults to XOF when no currency specified", () => {
    const result = fmt(10000);
    expect(result).toContain("XOF");
  });

  it("rounds XOF to whole numbers", () => {
    const result = fmt(10000, "XOF");
    expect(result).not.toContain(".");
  });
});
