import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { lignes: { include: { service: true, tarif: true } } },
  });

  if (!commande) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(commande);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { statut } = body;

  if (!["EN_ATTENTE", "CONFIRMEE", "ANNULEE", "PAYEE"].includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const commande = await prisma.commande.update({
    where: { id },
    data: { statut },
  });

  return NextResponse.json(commande);
}
