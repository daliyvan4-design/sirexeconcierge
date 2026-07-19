import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const chauffeur = await prisma.chauffeur.update({ where: { id }, data: body });
  return NextResponse.json(chauffeur);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { id } = await params;
  await prisma.chauffeur.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
