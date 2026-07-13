import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const body = await req.json();

  const event = await prisma.event.update({
    where: { id: params.id },
    data: { statut: body.statut },
  });

  return NextResponse.json({ success: true, data: event });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { error } = await requireRole("ULTRA_ADMIN");
  if (error) return error;

  await prisma.event.update({
    where: { id: params.id },
    data: { statut: "supprime" },
  });

  return NextResponse.json({ success: true });
}
