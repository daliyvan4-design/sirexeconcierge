import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  try {
    const residences = await prisma.residence.findMany({
      where: { statut: "actif" },
      include: {
        images: { orderBy: { ordre: "asc" } },
        tarifs: { where: { actif: true }, orderBy: { prixParNuit: "asc" } },
        _count: { select: { events: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: residences });
  } catch (err) {
    console.error("[residences] list error:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  try {
    const body = await req.json();

    const residence = await prisma.residence.create({
      data: {
        nom: body.nom,
        type: body.type ?? "hotel",
        description: body.description,
        adresse: body.adresse,
        ville: body.ville,
        quartier: body.quartier,
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        capacite: body.capacite ? parseInt(body.capacite) : 10,
        equipements: body.equipements,
        contactNom: body.contactNom,
        contactTel: body.contactTel,
        contactEmail: body.contactEmail,
      },
    });

    return NextResponse.json({ success: true, id: residence.id });
  } catch (err) {
    console.error("[residences] create error:", err);
    return NextResponse.json({ error: "Erreur creation" }, { status: 500 });
  }
}
