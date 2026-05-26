import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireRole("ULTRA_ADMIN", "SUPER_ADMIN");
  if (error) return error;

  const { commandeId } = await request.json();

  const commande = await prisma.commande.findUnique({
    where: { id: commandeId },
    include: { lignes: { include: { service: true } } },
  });
  if (!commande) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  await prisma.planningEntry.deleteMany({ where: { commandeId, auto: true } });

  const arrivalDate = new Date(commande.dateArrivee);
  const departureDate = new Date(commande.dateDepart);
  const totalDays = Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));

  const entries: Array<{
    commandeId: string;
    jour: number;
    heure: string;
    type: string;
    titre: string;
    details: string | null;
    serviceId: string | null;
    auto: boolean;
  }> = [];

  for (const ligne of commande.lignes) {
    const cat = ligne.service.categorie;

    if (cat === "transport") {
      entries.push({
        commandeId,
        jour: 1,
        heure: commande.heureArrivee || "08:00",
        type: "transport",
        titre: `${ligne.service.nom}`,
        details: null,
        serviceId: ligne.serviceId,
        auto: true,
      });
    } else if (cat === "hebergement") {
      for (let d = 1; d <= totalDays; d++) {
        entries.push({
          commandeId,
          jour: d,
          heure: d === 1 ? "14:00" : "00:00",
          type: "hebergement",
          titre: `${ligne.service.nom}`,
          details: `${ligne.quantite} nuit(s)`,
          serviceId: ligne.serviceId,
          auto: true,
        });
      }
    } else if (cat === "repas") {
      for (let d = 1; d <= totalDays; d++) {
        const heure = ligne.service.nom.toLowerCase().includes("petit") ? "07:30"
          : ligne.service.nom.toLowerCase().includes("déjeuner") || ligne.service.nom.toLowerCase().includes("lunch") ? "12:30"
          : "19:30";
        entries.push({
          commandeId,
          jour: d,
          heure,
          type: "repas",
          titre: `${ligne.service.nom}`,
          details: `${commande.nombrePersonnes} pax`,
          serviceId: ligne.serviceId,
          auto: true,
        });
      }
    } else {
      entries.push({
        commandeId,
        jour: 1,
        heure: "10:00",
        type: "extra",
        titre: `${ligne.service.nom}`,
        details: `Qté: ${ligne.quantite}`,
        serviceId: ligne.serviceId,
        auto: true,
      });
    }
  }

  if (entries.length > 0) {
    await prisma.planningEntry.createMany({ data: entries });
  }

  const created = await prisma.planningEntry.findMany({
    where: { commandeId, auto: true },
    orderBy: [{ jour: "asc" }, { heure: "asc" }],
  });

  return NextResponse.json(created, { status: 201 });
}
