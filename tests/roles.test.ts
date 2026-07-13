import { describe, it, expect } from "vitest";
import { ROLE_LABELS, ROLE_HIERARCHY, canManageRole } from "@/lib/roles";

describe("ROLE_LABELS", () => {
  it("has labels for all roles", () => {
    expect(ROLE_LABELS.ULTRA_ADMIN).toBe("Ultra Admin");
    expect(ROLE_LABELS.SUPER_ADMIN).toBe("Super Admin");
    expect(ROLE_LABELS.CONCIERGE).toBe("Concierge");
    expect(ROLE_LABELS.AGENT_INSTITUTIONNEL).toBe("Agent Institutionnel");
  });
});

describe("ROLE_HIERARCHY", () => {
  it("ULTRA_ADMIN has highest level", () => {
    expect(ROLE_HIERARCHY.ULTRA_ADMIN).toBeGreaterThan(ROLE_HIERARCHY.SUPER_ADMIN);
  });

  it("SUPER_ADMIN outranks CONCIERGE", () => {
    expect(ROLE_HIERARCHY.SUPER_ADMIN).toBeGreaterThan(ROLE_HIERARCHY.CONCIERGE);
  });

  it("CONCIERGE and AGENT_INSTITUTIONNEL are same level", () => {
    expect(ROLE_HIERARCHY.CONCIERGE).toBe(ROLE_HIERARCHY.AGENT_INSTITUTIONNEL);
  });
});

describe("canManageRole", () => {
  it("ULTRA_ADMIN can manage SUPER_ADMIN", () => {
    expect(canManageRole("ULTRA_ADMIN", "SUPER_ADMIN")).toBe(true);
  });

  it("ULTRA_ADMIN can manage CONCIERGE", () => {
    expect(canManageRole("ULTRA_ADMIN", "CONCIERGE")).toBe(true);
  });

  it("SUPER_ADMIN can manage CONCIERGE", () => {
    expect(canManageRole("SUPER_ADMIN", "CONCIERGE")).toBe(true);
  });

  it("SUPER_ADMIN cannot manage ULTRA_ADMIN", () => {
    expect(canManageRole("SUPER_ADMIN", "ULTRA_ADMIN")).toBe(false);
  });

  it("CONCIERGE cannot manage SUPER_ADMIN", () => {
    expect(canManageRole("CONCIERGE", "SUPER_ADMIN")).toBe(false);
  });

  it("CONCIERGE cannot manage another CONCIERGE", () => {
    expect(canManageRole("CONCIERGE", "CONCIERGE")).toBe(false);
  });

  it("ULTRA_ADMIN cannot manage another ULTRA_ADMIN", () => {
    expect(canManageRole("ULTRA_ADMIN", "ULTRA_ADMIN")).toBe(false);
  });

  it("AGENT_INSTITUTIONNEL cannot manage CONCIERGE (same level)", () => {
    expect(canManageRole("AGENT_INSTITUTIONNEL", "CONCIERGE")).toBe(false);
  });
});
