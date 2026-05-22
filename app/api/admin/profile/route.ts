import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const userId = (session.user as any).id;

  const user = await prisma.adminUser.update({
    where: { id: userId },
    data: { nom: body.nom, email: body.email },
  });

  return NextResponse.json({ nom: user.nom, email: user.email });
}
