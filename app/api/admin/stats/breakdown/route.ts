import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const lignes = await prisma.ligneCommande.findMany({
    include: { service: { select: { categorie: true } } },
  });

  const totals: Record<string, number> = { transport: 0, hebergement: 0, repas: 0, extras: 0 };
  let grandTotal = 0;

  for (const l of lignes) {
    const cat = l.service.categorie;
    totals[cat] = (totals[cat] || 0) + l.sousTotal;
    grandTotal += l.sousTotal;
  }

  const breakdown = Object.entries(totals).map(([cat, amount]) => ({
    categorie: cat,
    montant: amount,
    pourcentage: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
  }));

  return NextResponse.json(breakdown);
}
