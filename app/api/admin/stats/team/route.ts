import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const concierges = await prisma.adminUser.findMany({
    where: { role: "CONCIERGE", actif: true },
    select: {
      id: true,
      nom: true,
      assignments: {
        where: {
          actif: true,
          commande: { dateDepart: { gte: today } },
        },
        select: { id: true },
      },
      notes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const result = concierges.map((c) => {
    const words = c.nom.split(" ");
    const initials = words.map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    return {
      id: c.id,
      nom: c.nom,
      initials,
      activeClients: c.assignments.length,
      lastNoteDate: c.notes[0]?.createdAt || null,
    };
  });

  return NextResponse.json({
    concierges: result,
    activeClientsTotal: result.reduce((s, c) => s + c.activeClients, 0),
    conciergesActifs: result.length,
  });
}
