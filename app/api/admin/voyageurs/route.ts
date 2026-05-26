import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const commandes = await prisma.commande.findMany({
    ...(search
      ? {
          where: {
            OR: [
              { nom: { contains: search } },
              { prenom: { contains: search } },
              { email: { contains: search } },
            ],
          },
        }
      : {}),
    orderBy: { createdAt: "desc" },
  });

  const voyageurMap = new Map<string, {
    email: string;
    prenom: string;
    nom: string;
    telephone: string;
    nationalite: string;
    commandeCount: number;
    totalAmount: number;
    lastOrder: string;
  }>();

  for (const c of commandes) {
    const key = c.email.toLowerCase();
    const existing = voyageurMap.get(key);
    if (existing) {
      existing.commandeCount++;
      existing.totalAmount += c.montantTotal;
    } else {
      voyageurMap.set(key, {
        email: c.email,
        prenom: c.prenom,
        nom: c.nom,
        telephone: c.telephone,
        nationalite: c.nationalite,
        commandeCount: 1,
        totalAmount: c.montantTotal,
        lastOrder: c.createdAt.toISOString(),
      });
    }
  }

  return NextResponse.json(Array.from(voyageurMap.values()));
}
