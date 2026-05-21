import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayOrders, yesterdayOrders, todayCA, yesterdayCA, pending, monthTotal, monthConfirmed] =
    await Promise.all([
      prisma.commande.count({ where: { createdAt: { gte: today } } }),
      prisma.commande.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
      prisma.commande.aggregate({ where: { createdAt: { gte: today } }, _sum: { montantTotal: true } }),
      prisma.commande.aggregate({ where: { createdAt: { gte: yesterday, lt: today } }, _sum: { montantTotal: true } }),
      prisma.commande.count({ where: { statut: "EN_ATTENTE" } }),
      prisma.commande.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.commande.count({ where: { createdAt: { gte: monthStart }, statut: "CONFIRMEE" } }),
    ]);

  const caToday = todayCA._sum.montantTotal || 0;
  const caYesterday = yesterdayCA._sum.montantTotal || 0;

  return NextResponse.json({
    ordersToday: todayOrders,
    ordersYesterday: yesterdayOrders,
    caToday,
    caYesterday,
    pending,
    monthTotal,
    monthConfirmed,
  });
}
