import { describe, it, expect, vi, beforeEach } from "vitest";

describe("GeniusPay", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("isGeniusPayConfigured returns false when keys are missing", async () => {
    vi.stubEnv("GENIUSPAY_PUBLIC_KEY", "");
    vi.stubEnv("GENIUSPAY_SECRET_KEY", "");
    const { isGeniusPayConfigured } = await import("@/lib/geniuspay");
    expect(isGeniusPayConfigured()).toBe(false);
  });

  it("isGeniusPayConfigured returns true when keys are set", async () => {
    vi.stubEnv("GENIUSPAY_PUBLIC_KEY", "pk_test_123");
    vi.stubEnv("GENIUSPAY_SECRET_KEY", "sk_test_456");
    const mod = await import("@/lib/geniuspay");
    expect(mod.isGeniusPayConfigured()).toBe(true);
  });

  it("createPayment throws when not configured", async () => {
    vi.stubEnv("GENIUSPAY_PUBLIC_KEY", "");
    vi.stubEnv("GENIUSPAY_SECRET_KEY", "");
    const { createPayment, GeniusPayError } = await import("@/lib/geniuspay");
    await expect(
      createPayment({ amount: 5000 })
    ).rejects.toThrow("GeniusPay API keys are not configured");
  });

  it("verifyWebhookSignature returns false when secret is missing", async () => {
    vi.stubEnv("GENIUSPAY_WEBHOOK_SECRET", "");
    const { verifyWebhookSignature } = await import("@/lib/geniuspay");
    expect(verifyWebhookSignature("ts", "payload", "sig")).toBe(false);
  });
});
