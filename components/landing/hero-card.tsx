"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Hotel, Car, UtensilsCrossed, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SERVICES: { icon: LucideIcon; label: string; tag: string; highlight: boolean }[] = [
  { icon: Hotel, label: "Appart-hôtels & meublés", tag: "AÏKO direct", highlight: true },
  { icon: Car, label: "Transport VIP", tag: "Chauffeur privé", highlight: false },
  { icon: UtensilsCrossed, label: "Restauration", tag: "Tables réservées", highlight: false },
  { icon: Star, label: "Services premium", tag: "Sur-mesure", highlight: false },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return { days, hours, mins };
}

export function HeroCard() {
  const t = useTranslations();
  const locale = useLocale();
  const eventDate = new Date("2026-03-11T08:00:00");
  const { days, hours, mins } = useCountdown(eventDate);

  return (
    <div className="rounded-[4px] overflow-hidden bg-ink">
      {/* Countdown header */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-cream/50">
              Salon 2026 · Abidjan
            </span>
          </div>
          <span className="text-[10px] mono text-cream/40">11 → 17 mars</span>
        </div>
        <div className="flex items-end gap-6">
          <div className="text-center">
            <div className="figure text-[36px] text-cream leading-none">{days}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-cream/40 mt-1">jours</div>
          </div>
          <div className="text-gold/40 text-[24px] font-light mb-1">:</div>
          <div className="text-center">
            <div className="figure text-[36px] text-cream leading-none">{String(hours).padStart(2, "0")}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-cream/40 mt-1">heures</div>
          </div>
          <div className="text-gold/40 text-[24px] font-light mb-1">:</div>
          <div className="text-center">
            <div className="figure text-[36px] text-cream leading-none">{String(mins).padStart(2, "0")}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-cream/40 mt-1">min</div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-cream/8 mx-6" />

      {/* Services */}
      <div className="px-6 py-5">
        <p className="text-[10px] tracking-[0.28em] uppercase text-cream/50 mb-4">
          Nos services
        </p>
        <div className="space-y-2.5">
          {SERVICES.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 transition-colors ${
                s.highlight
                  ? "bg-gold/10 border border-gold/20"
                  : "bg-cream/[0.03] border border-cream/[0.06] hover:bg-cream/[0.06]"
              }`}
            >
              <s.icon className={`w-5 h-5 ${s.highlight ? "text-gold" : "text-cream/60"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-tight ${s.highlight ? "text-gold font-medium" : "text-cream"}`}>
                  {s.label}
                </p>
                <p className="text-[10px] text-cream/40 mt-0.5">{s.tag}</p>
              </div>
              {s.highlight && (
                <span className="text-[9px] uppercase tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded-full font-medium">
                  Nouveau
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-ink2 px-6 py-3.5 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.18em] uppercase text-cream/50 mono">
          Réservation en 3 min
        </span>
        <a
          href={`/${locale}/reservation`}
          className="text-[11px] text-gold font-medium flex items-center gap-1 hover:text-gold2 transition-colors"
        >
          Réserver →
        </a>
      </div>
    </div>
  );
}
