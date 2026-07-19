import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const ALL_ROLES: Role[] = ["ADMIN", "SUPERVISEUR", "CONCIERGE", "AGENT_INSTITUTIONNEL", "SCANNER"];

export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  }
  if (!roles.includes(session.user.role)) {
    return { session: null, error: NextResponse.json({ error: "Accès refusé" }, { status: 403 }) };
  }
  return { session, error: null };
}

export async function requireAnyAdmin() {
  return requireRole(...ALL_ROLES);
}
