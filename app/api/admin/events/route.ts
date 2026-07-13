import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participants: true } } },
  });

  return NextResponse.json({ success: true, data: events });
}
