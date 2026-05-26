import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN", "CONCIERGE");
  if (error) return error;

  const body = await request.json();
  const userId = session!.user.id;

  const user = await prisma.adminUser.update({
    where: { id: userId },
    data: { nom: body.nom, email: body.email },
  });

  return NextResponse.json({ nom: user.nom, email: user.email });
}
