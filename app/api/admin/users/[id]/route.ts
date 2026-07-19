import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { canManageRole } from "@/lib/roles";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { id } = await params;

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (!canManageRole(session!.user.role, target.role)) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer ce rôle" }, { status: 403 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (!canManageRole(session!.user.role, target.role)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const data: any = {};
  if (body.nom !== undefined) data.nom = body.nom;
  if (body.actif !== undefined) data.actif = body.actif;

  const updated = await prisma.adminUser.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id, email: updated.email, nom: updated.nom, role: updated.role, actif: updated.actif });
}
