import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const base = slugify(body.nom);
    const slug = `${base}-${Date.now().toString(36)}`;

    const event = await prisma.event.create({
      data: {
        slug,
        nom: body.nom,
        type: body.type ?? "conference",
        description: body.description,
        organisateur: body.organisateur,
        lieu: body.lieu,
        ville: body.ville,
        dateDebut: new Date(body.dateDebut),
        dateFin: new Date(body.dateFin),
        capacite: body.capacite ? parseInt(body.capacite) : 500,
        badgePayant: body.badgePayant ?? false,
        prixBadge: body.prixBadge ? parseFloat(body.prixBadge) : 0,
        ticketPayant: body.ticketPayant ?? false,
        prixTicket: body.prixTicket ? parseFloat(body.prixTicket) : 0,
        contactEmail: body.contactEmail,
        contactTel: body.contactTel,
        statut: body.statut ?? "actif",
        paymentRef: body.paymentRef,
      },
    });

    return NextResponse.json({ success: true, slug: event.slug, id: event.id });
  } catch (err) {
    console.error("[events] create error:", err);
    return NextResponse.json({ error: "Erreur creation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { statut: "actif" },
      orderBy: { dateDebut: "asc" },
      include: { _count: { select: { participants: true } } },
    });

    return NextResponse.json({ success: true, data: events });
  } catch (err) {
    console.error("[events] list error:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
