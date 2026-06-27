"use client";

import { Car, Utensils, Hotel, Sparkles, MessageSquare } from "lucide-react";

interface PlanningEntry {
  id: string;
  jour: number;
  heure: string;
  type: string;
  titre: string;
  details: string | null;
  auto: boolean;
}

const TYPE_CONFIG: Record<string, { icon: typeof Car; color: string; bg: string }> = {
  transport: { icon: Car, color: "text-ink", bg: "bg-ink/5" },
  repas: { icon: Utensils, color: "text-gold2", bg: "bg-gold/10" },
  hebergement: { icon: Hotel, color: "text-gold", bg: "bg-gold/10" },
  extra: { icon: Sparkles, color: "text-ink", bg: "bg-ink/5" },
  custom: { icon: MessageSquare, color: "text-gold", bg: "bg-gold/10" },
};

interface PlanningTimelineProps {
  entries: PlanningEntry[];
  arrivalDate: string;
}

export function PlanningTimeline({ entries, arrivalDate }: PlanningTimelineProps) {
  const arrival = new Date(arrivalDate);
  const days = Array.from(new Set(entries.map((e) => e.jour))).sort((a, b) => a - b);

  function getDayDate(jour: number): string {
    const d = new Date(arrival);
    d.setDate(d.getDate() + jour - 1);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  }

  return (
    <div className="space-y-8">
      {days.map((jour) => (
        <div key={jour}>
          <h3 className="font-serif text-[16px] text-ink mb-4 capitalize">
            Jour {jour} — {getDayDate(jour)}
          </h3>
          <div className="space-y-3">
            {entries
              .filter((e) => e.jour === jour)
              .map((entry) => {
                const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.custom;
                const Icon = config.icon;
                return (
                  <div key={entry.id} className="flex gap-3 items-start">
                    <div className="text-[13px] mono text-mute w-12 pt-1 shrink-0">{entry.heure}</div>
                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-ink font-medium">{entry.titre}</p>
                      {entry.details && <p className="text-[12px] text-mute mt-0.5">{entry.details}</p>}
                      {!entry.auto && (
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                          Manuel
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
