import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireRole("ADMIN", "SUPERVISEUR", "CONCIERGE");
  if (error) return error;

  const { currentPassword, newPassword } = await request.json();
  const userId = session!.user.id;

  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({ where: { id: userId }, data: { passwordHash: hash } });

  return NextResponse.json({ ok: true });
}
