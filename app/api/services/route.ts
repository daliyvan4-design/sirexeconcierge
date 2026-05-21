import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { actif: true },
    include: { tarifs: { where: { actif: true } } },
    orderBy: { ordre: "asc" },
  });

  const grouped = {
    transport: services.filter((s) => s.categorie === "transport"),
    hebergement: services.filter((s) => s.categorie === "hebergement"),
    repas: services.filter((s) => s.categorie === "repas"),
    extra: services.filter((s) => s.categorie === "extras"),
  };

  return NextResponse.json(grouped);
}
