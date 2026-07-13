import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await prisma.event.findFirst({
    where: { OR: [{ slug: params.id }, { id: params.id }] },
    select: { nom: true, description: true, ville: true, lieu: true, coverUrl: true },
  });

  if (!event) return { title: "AÏKO Event" };

  return {
    title: `${event.nom} — AÏKO Event`,
    description: event.description || `${event.nom} — ${event.lieu}, ${event.ville}`,
    openGraph: {
      title: event.nom,
      description: event.description || `${event.lieu}, ${event.ville}`,
      ...(event.coverUrl && { images: [{ url: event.coverUrl }] }),
    },
  };
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return children;
}
