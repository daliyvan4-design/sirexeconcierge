import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin-auth";

export async function GET() {
  const { session, error } = await requireRole("CONCIERGE");
  if (error) return error;

  const userId = (session!.user as any).id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const assignments = await prisma.assignment.findMany({
    where: { conciergeId: userId, actif: true },
    include: {
      commande: {
        select: {
          id: true,
          reference: true,
          prenom: true,
          nom: true,
          dateArrivee: true,
          dateDepart: true,
          nombrePersonnes: true,
          statut: true,
        },
      },
    },
  });

  const clients = assignments.map((a) => ({
    commandeId: a.commande.id,
    reference: a.commande.reference,
    prenom: a.commande.prenom,
    nom: a.commande.nom,
    dateArrivee: a.commande.dateArrivee,
    dateDepart: a.commande.dateDepart,
    nombrePersonnes: a.commande.nombrePersonnes,
    statut: a.commande.statut,
  }));

  const commandeIds = clients.map((c) => c.commandeId);

  const allPlanning = await prisma.planningEntry.findMany({
    where: { commandeId: { in: commandeIds } },
    include: {
      commande: { select: { prenom: true, nom: true, dateArrivee: true } },
    },
    orderBy: { heure: "asc" },
  });

  const todayPlanning = allPlanning.filter((p) => {
    const arrival = new Date(p.commande.dateArrivee);
    arrival.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
    return p.jour === diffDays + 1;
  }).map((p) => ({
    heure: p.heure,
    clientName: `${p.commande.prenom} ${p.commande.nom}`,
    titre: p.titre,
    type: p.type,
  }));

  const recentNotes = await prisma.note.findMany({
    where: { commandeId: { in: commandeIds } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      auteur: { select: { nom: true } },
      commande: { select: { prenom: true, nom: true } },
    },
  });

  return NextResponse.json({
    clients,
    todayPlanning,
    recentNotes: recentNotes.map((n) => ({
      id: n.id,
      auteurNom: n.auteur.nom,
      clientName: `${n.commande.prenom} ${n.commande.nom}`,
      contenu: n.contenu,
      createdAt: n.createdAt,
    })),
  });
}
