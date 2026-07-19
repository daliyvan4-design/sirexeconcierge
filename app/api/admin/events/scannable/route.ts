import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR", "SCANNER");
  if (error) return error;

  const events = await prisma.event.findMany({
    where: { statut: "actif" },
    orderBy: { dateDebut: "asc" },
    select: {
      id: true,
      slug: true,
      nom: true,
      type: true,
      lieu: true,
      ville: true,
      dateDebut: true,
      dateFin: true,
      capacite: true,
      statut: true,
      _count: { select: { participants: true } },
      participants: {
        where: { checkedIn: true },
        select: { id: true },
      },
    },
  });

  const data = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    nom: e.nom,
    type: e.type,
    lieu: e.lieu,
    ville: e.ville,
    dateDebut: e.dateDebut,
    dateFin: e.dateFin,
    capacite: e.capacite,
    statut: e.statut,
    _count: e._count,
    checkedInCount: e.participants.length,
  }));

  return NextResponse.json({ success: true, data });
}
