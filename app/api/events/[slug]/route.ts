import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      include: {
        _count: { select: { participants: true } },
        participants: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Evenement introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (err) {
    console.error("[events] get error:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
