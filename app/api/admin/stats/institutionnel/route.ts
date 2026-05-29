import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("AGENT_INSTITUTIONNEL", "ULTRA_ADMIN");
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allOrders = await prisma.commande.findMany({
    where: { typeReservation: "INSTITUTIONNELLE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reference: true,
      prenom: true,
      nom: true,
      email: true,
      telephone: true,
      nationalite: true,
      dateArrivee: true,
      dateDepart: true,
      nombrePersonnes: true,
      statut: true,
      montantTotal: true,
      devise: true,
      createdAt: true,
    },
  });

  const pending = allOrders.filter((o) => o.statut === "EN_ATTENTE").length;
  const confirmed = allOrders.filter((o) => o.statut === "CONFIRMEE").length;
  const totalPax = allOrders.reduce((s, o) => s + o.nombrePersonnes, 0);
  const totalCA = allOrders.reduce((s, o) => s + o.montantTotal, 0);

  const upcoming = allOrders.filter((o) => {
    const arr = new Date(o.dateArrivee);
    arr.setHours(0, 0, 0, 0);
    return arr >= today;
  });

  return NextResponse.json({
    orders: allOrders,
    stats: {
      total: allOrders.length,
      pending,
      confirmed,
      totalPax,
      totalCA,
      upcoming: upcoming.length,
    },
  });
}
