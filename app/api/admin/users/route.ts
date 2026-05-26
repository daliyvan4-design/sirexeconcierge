import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const { error } = await requireRole("ULTRA_ADMIN");
  if (error) return error;

  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, nom: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN");
  if (error) return error;

  const { email, nom, password } = await request.json();
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.create({
    data: { email, nom, passwordHash: hash, role: "admin" },
  });

  return NextResponse.json({ id: user.id, email: user.email, nom: user.nom }, { status: 201 });
}
