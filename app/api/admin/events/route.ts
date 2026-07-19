import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR", "AGENT_INSTITUTIONNEL");
  if (error) return error;

  const isInstitutionnel = session!.user.role === "AGENT_INSTITUTIONNEL";

  const events = await prisma.event.findMany({
    where: isInstitutionnel ? { institutionnel: true } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participants: true } } },
  });

  return NextResponse.json({ success: true, data: events });
}
