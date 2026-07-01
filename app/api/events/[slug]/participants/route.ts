import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function genRef() {
  return `AIKO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
      include: { _count: { select: { participants: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Evenement introuvable" }, { status: 404 });
    }

    const body = await req.json();
    const ticketNumber = event._count.participants + 1;

    const participant = await prisma.participant.create({
      data: {
        eventId: event.id,
        reference: genRef(),
        ticketNumber,
        prenom: body.prenom,
        nom: body.nom,
        email: body.email,
        telephone: body.telephone,
        organisation: body.organisation,
        type: body.type ?? (event.type === "concert" ? "ticket" : "badge"),
        montant: body.montant ?? 0,
        paymentRef: body.paymentRef,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        reference: participant.reference,
        ticketNumber: participant.ticketNumber,
        type: participant.type,
      },
    });
  } catch (err) {
    console.error("[participants] create error:", err);
    return NextResponse.json({ error: "Erreur inscription" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: params.slug },
    });

    if (!event) {
      return NextResponse.json({ error: "Evenement introuvable" }, { status: 404 });
    }

    const participants = await prisma.participant.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: participants });
  } catch (err) {
    console.error("[participants] list error:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
