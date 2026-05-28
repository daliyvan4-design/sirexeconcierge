"use client";

import { Car, Utensils, Hotel, Sparkles, MessageSquare } from "lucide-react";

interface TimelineEntry {
  heure: string;
  clientName: string;
  titre: string;
  type: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof Car; color: string; bg: string }> = {
  transport: { icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
  repas: { icon: Utensils, color: "text-orange-600", bg: "bg-orange-50" },
  hebergement: { icon: Hotel, color: "text-purple-600", bg: "bg-purple-50" },
  extra: { icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50" },
  custom: { icon: MessageSquare, color: "text-gold", bg: "bg-gold/10" },
};

interface DayTimelineProps {
  entries: TimelineEntry[];
}

export function DayTimeline({ entries }: DayTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-line p-5 shadow-card">
        <h3 className="font-serif text-[18px] text-ink mb-4">Planning du jour</h3>
        <p className="text-mute text-[13px] text-center py-6">Aucune entrée prévue aujourd&apos;hui</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-line shadow-card">
      <div className="px-5 py-4">
        <h3 className="font-serif text-[18px] text-ink">Planning du jour</h3>
      </div>
      <div className="divide-y divide-line">
        {entries.map((entry, i) => {
          const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.custom;
          const Icon = config.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <span className="text-[13px] mono text-mute w-12 shrink-0">{entry.heure}</span>
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-ink font-medium truncate">{entry.titre}</p>
                <p className="text-[11px] text-mute">{entry.clientName}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
