import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  ULTRA_ADMIN: "Ultra Admin",
  SUPER_ADMIN: "Super Admin",
  CONCIERGE: "Concierge",
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  ULTRA_ADMIN: 3,
  SUPER_ADMIN: 2,
  CONCIERGE: 1,
};

export function canManageRole(actor: Role, target: Role): boolean {
  return ROLE_HIERARCHY[actor] > ROLE_HIERARCHY[target];
}
