import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR", "CONCIERGE");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const commandeId = searchParams.get("commandeId");
  const conciergeId = searchParams.get("conciergeId");

  const where: any = { actif: true };
  if (commandeId) where.commandeId = commandeId;

  if (session!.user.role === "CONCIERGE") {
    where.conciergeId = session!.user.id;
  } else if (conciergeId) {
    where.conciergeId = conciergeId;
  }

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      commande: { select: { id: true, reference: true, prenom: true, nom: true, dateArrivee: true, dateDepart: true, nombrePersonnes: true, statut: true } },
      concierge: { select: { id: true, nom: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assignments);
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { conciergeId, commandeId } = await request.json();

  const concierge = await prisma.adminUser.findFirst({
    where: { id: conciergeId, role: "CONCIERGE", actif: true },
  });
  if (!concierge) return NextResponse.json({ error: "Concierge introuvable" }, { status: 404 });

  const assignment = await prisma.assignment.upsert({
    where: { conciergeId_commandeId: { conciergeId, commandeId } },
    update: { actif: true },
    create: { conciergeId, commandeId },
    include: {
      commande: { select: { reference: true, prenom: true, nom: true } },
      concierge: { select: { nom: true } },
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}
