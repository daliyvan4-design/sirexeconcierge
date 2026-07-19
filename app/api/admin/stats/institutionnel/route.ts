import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("AGENT_INSTITUTIONNEL", "ADMIN", "SUPERVISEUR");
  if (error) return error;

  const events = await prisma.event.findMany({
    where: { institutionnel: true },
    orderBy: { dateDebut: "asc" },
    include: {
      _count: { select: { participants: true } },
      participants: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          prenom: true,
          nom: true,
          email: true,
          telephone: true,
          organisation: true,
          ticketNumber: true,
          checkedIn: true,
          createdAt: true,
        },
      },
    },
  });

  const totalParticipants = events.reduce((s, e) => s + e._count.participants, 0);
  const actifs = events.filter((e) => e.statut === "actif").length;

  return NextResponse.json({
    events,
    stats: {
      totalEvents: events.length,
      actifs,
      totalParticipants,
    },
  });
}
