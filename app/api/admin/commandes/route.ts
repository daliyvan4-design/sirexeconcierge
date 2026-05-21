import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const where: any = {};
  if (status) where.statut = status;
  if (search) {
    where.OR = [
      { reference: { contains: search } },
      { nom: { contains: search } },
      { prenom: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.commande.findMany({
      where,
      include: { lignes: { include: { service: { select: { categorie: true } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.commande.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}
