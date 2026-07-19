import { describe, it, expect } from "vitest";
import { ROLE_LABELS, ROLE_HIERARCHY, canManageRole } from "@/lib/roles";

describe("ROLE_LABELS", () => {
  it("has labels for all roles", () => {
    expect(ROLE_LABELS.ADMIN).toBe("Admin");
    expect(ROLE_LABELS.SUPERVISEUR).toBe("Superviseur");
    expect(ROLE_LABELS.CONCIERGE).toBe("Concierge");
    expect(ROLE_LABELS.AGENT_INSTITUTIONNEL).toBe("Agent Institutionnel");
    expect(ROLE_LABELS.SCANNER).toBe("Scanner");
  });
});

describe("ROLE_HIERARCHY", () => {
  it("ADMIN has highest level", () => {
    expect(ROLE_HIERARCHY.ADMIN).toBeGreaterThan(ROLE_HIERARCHY.SUPERVISEUR);
  });

  it("SUPERVISEUR outranks CONCIERGE", () => {
    expect(ROLE_HIERARCHY.SUPERVISEUR).toBeGreaterThan(ROLE_HIERARCHY.CONCIERGE);
  });

  it("CONCIERGE and AGENT_INSTITUTIONNEL are same level", () => {
    expect(ROLE_HIERARCHY.CONCIERGE).toBe(ROLE_HIERARCHY.AGENT_INSTITUTIONNEL);
  });

  it("SCANNER is lowest", () => {
    expect(ROLE_HIERARCHY.SCANNER).toBeLessThan(ROLE_HIERARCHY.CONCIERGE);
  });
});

describe("canManageRole", () => {
  it("ADMIN can manage SUPERVISEUR", () => {
    expect(canManageRole("ADMIN", "SUPERVISEUR")).toBe(true);
  });

  it("ADMIN can manage CONCIERGE", () => {
    expect(canManageRole("ADMIN", "CONCIERGE")).toBe(true);
  });

  it("SUPERVISEUR can manage CONCIERGE", () => {
    expect(canManageRole("SUPERVISEUR", "CONCIERGE")).toBe(true);
  });

  it("SUPERVISEUR can manage SCANNER", () => {
    expect(canManageRole("SUPERVISEUR", "SCANNER")).toBe(true);
  });

  it("SUPERVISEUR cannot manage ADMIN", () => {
    expect(canManageRole("SUPERVISEUR", "ADMIN")).toBe(false);
  });

  it("CONCIERGE cannot manage SUPERVISEUR", () => {
    expect(canManageRole("CONCIERGE", "SUPERVISEUR")).toBe(false);
  });

  it("same role cannot manage itself", () => {
    expect(canManageRole("ADMIN", "ADMIN")).toBe(false);
  });

  it("SCANNER cannot manage anyone", () => {
    expect(canManageRole("SCANNER", "CONCIERGE")).toBe(false);
  });

  it("AGENT_INSTITUTIONNEL cannot manage CONCIERGE (same level)", () => {
    expect(canManageRole("AGENT_INSTITUTIONNEL", "CONCIERGE")).toBe(false);
  });
});
