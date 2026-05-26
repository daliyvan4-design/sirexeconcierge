import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const { actif } = await request.json();

  const assignment = await prisma.assignment.update({
    where: { id },
    data: { actif },
  });

  return NextResponse.json(assignment);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  await prisma.assignment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
