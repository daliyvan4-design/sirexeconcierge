import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const chauffeurs = await prisma.chauffeur.findMany({ orderBy: { nom: "asc" } });
  return NextResponse.json(chauffeurs);
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const body = await request.json();
  const chauffeur = await prisma.chauffeur.create({
    data: {
      nom: body.nom,
      telephone: body.telephone,
      vehicule: body.vehicule,
      immatriculation: body.immatriculation,
      statut: body.statut || "disponible",
    },
  });
  return NextResponse.json(chauffeur, { status: 201 });
}
