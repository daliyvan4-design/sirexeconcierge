import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole("ADMIN", "SUPERVISEUR");
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  const where: any = {};
  if (status) where.statut = status;

  const commandes = await prisma.commande.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const header = "Référence,Prénom,Nom,Email,Téléphone,Nationalité,Arrivée,Départ,Personnes,Montant,Devise,Statut\n";
  const rows = commandes.map((c) =>
    [
      c.reference,
      c.prenom,
      c.nom,
      c.email,
      c.telephone,
      c.nationalite,
      c.dateArrivee.toISOString().split("T")[0],
      c.dateDepart.toISOString().split("T")[0],
      c.nombrePersonnes,
      c.montantTotal,
      c.devise,
      c.statut,
    ].join(",")
  ).join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=commandes-aiko-${new Date().toISOString().split("T")[0]}.csv`,
    },
  });
}
