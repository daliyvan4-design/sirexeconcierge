import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR", "CONCIERGE");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const data: any = {};
  if (body.heure !== undefined) data.heure = body.heure;
  if (body.titre !== undefined) data.titre = body.titre;
  if (body.details !== undefined) data.details = body.details;
  if (body.type !== undefined) data.type = body.type;

  const entry = await prisma.planningEntry.update({ where: { id }, data });
  return NextResponse.json(entry);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { id } = await params;
  await prisma.planningEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
