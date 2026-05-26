import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const commandes = await prisma.commande.findMany({
    where: { statut: { not: "ANNULEE" } },
    select: { dateArrivee: true },
  });

  const counts: Record<string, number> = {};
  for (const c of commandes) {
    const day = c.dateArrivee.toISOString().split("T")[0];
    counts[day] = (counts[day] || 0) + 1;
  }

  return NextResponse.json(counts);
}
