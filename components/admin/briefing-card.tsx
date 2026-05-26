"use client";

import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { Calendar, Users, ChevronRight } from "lucide-react";

interface BriefingCardProps {
  commandeId: string;
  reference: string;
  clientName: string;
  dateArrivee: string;
  dateDepart: string;
  nombrePersonnes: number;
  statut: string;
}

export function BriefingCard({
  commandeId,
  reference,
  clientName,
  dateArrivee,
  dateDepart,
  nombrePersonnes,
  statut,
}: BriefingCardProps) {
  const arrival = new Date(dateArrivee).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const departure = new Date(dateDepart).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Link
      href={`/briefing/${commandeId}`}
      className="block bg-white rounded-2xl border border-line p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-serif text-[18px] text-ink">{clientName}</p>
          <p className="text-[12px] text-mute mono">{reference}</p>
        </div>
        <StatusBadge status={statut} />
      </div>
      <div className="flex items-center gap-4 text-[13px] text-mute">
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {arrival} → {departure}
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} /> {nombrePersonnes} pax
        </span>
      </div>
      <div className="flex justify-end mt-3">
        <span className="text-[12px] text-gold flex items-center gap-1">
          Voir le carnet <ChevronRight size={14} />
        </span>
      </div>
    </Link>
  );
}
