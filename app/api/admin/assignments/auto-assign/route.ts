import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { commandeId } = await request.json();

  const commande = await prisma.commande.findUnique({ where: { id: commandeId } });
  if (!commande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const concierges = await prisma.adminUser.findMany({
    where: { role: "CONCIERGE", actif: true },
    include: { assignments: { where: { actif: true } } },
  });

  if (concierges.length === 0) {
    return NextResponse.json({ error: "Aucun concierge disponible" }, { status: 400 });
  }

  const sorted = concierges.sort((a, b) => a.assignments.length - b.assignments.length);
  const chosen = sorted[0];

  const assignment = await prisma.assignment.upsert({
    where: { conciergeId_commandeId: { conciergeId: chosen.id, commandeId } },
    update: { actif: true },
    create: { conciergeId: chosen.id, commandeId },
    include: {
      concierge: { select: { nom: true, email: true } },
      commande: { select: { reference: true } },
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}
