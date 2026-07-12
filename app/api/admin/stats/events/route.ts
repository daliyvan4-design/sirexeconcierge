import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const events = await prisma.event.findMany({
    where: { statut: "actif" },
    include: {
      participants: {
        select: { montant: true, checkedIn: true, statut: true },
      },
    },
    orderBy: { dateDebut: "desc" },
  });

  let totalParticipants = 0;
  let totalRevenue = 0;
  let totalCheckins = 0;

  const eventList = events.map((ev) => {
    const confirmed = ev.participants.filter((p) => p.statut === "confirme");
    const revenue = confirmed.reduce((sum, p) => sum + p.montant, 0);
    const checkins = confirmed.filter((p) => p.checkedIn).length;

    totalParticipants += confirmed.length;
    totalRevenue += revenue;
    totalCheckins += checkins;

    return {
      slug: ev.slug,
      nom: ev.nom,
      participants: confirmed.length,
      revenue,
      checkins,
      dateDebut: ev.dateDebut.toISOString(),
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      totalEvents: events.length,
      totalParticipants,
      totalRevenue,
      totalCheckins,
      events: eventList,
    },
  });
}
