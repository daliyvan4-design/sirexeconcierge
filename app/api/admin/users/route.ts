import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import { canManageRole } from "@/lib/roles";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function GET() {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, nom: true, role: true, actif: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  if (session!.user.role === "SUPER_ADMIN") {
    return NextResponse.json(users.filter((u) => u.role === "CONCIERGE"));
  }

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { email, nom, password, role } = await request.json();
  const targetRole = (role as Role) || "CONCIERGE";

  if (!canManageRole(session!.user.role, targetRole)) {
    return NextResponse.json({ error: "Vous ne pouvez pas créer ce rôle" }, { status: 403 });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.create({
    data: { email, nom, passwordHash: hash, role: targetRole },
  });

  return NextResponse.json({ id: user.id, email: user.email, nom: user.nom, role: user.role }, { status: 201 });
}
