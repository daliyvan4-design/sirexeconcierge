import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const residence = await prisma.residence.findUnique({
    where: { id: params.id },
    select: { nom: true, description: true, ville: true, adresse: true },

  });

  if (!residence) return { title: "AÏKO Résidence" };

  return {
    title: `${residence.nom} — AÏKO Résidences`,
    description: residence.description || `${residence.nom} — ${residence.adresse}, ${residence.ville}`,
    openGraph: {
      title: residence.nom,
      description: residence.description || `${residence.adresse}, ${residence.ville}`,
    },
  };
}

export default function ResidenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
