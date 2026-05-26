import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN");
  if (error) return error;

  const { id } = await params;
  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
