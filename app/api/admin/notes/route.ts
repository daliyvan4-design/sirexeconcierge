import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
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

  const notes = await prisma.note.findMany({
    where: { commandeId },
    include: { auteur: { select: { nom: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const { commandeId, contenu } = await request.json();

  if (session!.user.role === "CONCIERGE") {
    const assignment = await prisma.assignment.findFirst({
      where: { commandeId, conciergeId: session!.user.id, actif: true },
    });
    if (!assignment) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const note = await prisma.note.create({
    data: { commandeId, auteurId: session!.user.id, contenu },
    include: { auteur: { select: { nom: true, role: true } } },
  });

  return NextResponse.json(note, { status: 201 });
}
