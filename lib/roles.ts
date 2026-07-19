import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  SUPERVISEUR: "Superviseur",
  CONCIERGE: "Concierge",
  AGENT_INSTITUTIONNEL: "Agent Institutionnel",
  SCANNER: "Scanner",
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 4,
  SUPERVISEUR: 3,
  AGENT_INSTITUTIONNEL: 2,
  CONCIERGE: 2,
  SCANNER: 1,
};

export function canManageRole(actor: Role, target: Role): boolean {
  return ROLE_HIERARCHY[actor] > ROLE_HIERARCHY[target];
}
