import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR", "CONCIERGE");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const commandeId = searchParams.get("commandeId");
  if (!commandeId) return NextResponse.json({ error: "commandeId requis" }, { status: 400 });

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const entries = await prisma.planningEntry.findMany({
    where: { commandeId },
    include: { service: { select: { nom: true, categorie: true, icon: true } } },
    orderBy: [{ jour: "asc" }, { heure: "asc" }],
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR", "CONCIERGE");
  if (error) return error;

  const { commandeId, jour, heure, type, titre, details, serviceId } = await request.json();

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const entry = await prisma.planningEntry.create({
    data: { commandeId, jour, heure, type, titre, details, serviceId, auto: false },
  });

  return NextResponse.json(entry, { status: 201 });
}
