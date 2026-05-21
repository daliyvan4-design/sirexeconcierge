"use client";

import { useTranslations } from "next-intl";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { fmt } from "@/lib/utils";
import type { ServiceItem } from "./types";

interface HotelCardProps {
  service: ServiceItem;
  selected: boolean;
  nights: number;
  defaultNights: number;
  onSelect: () => void;
  onNightsChange: (n: number) => void;
}

export function HotelCard({
  service,
  selected,
  nights,
  defaultNights,
  onSelect,
  onNightsChange,
}: HotelCardProps) {
  const t = useTranslations("s3");

  return (
    <div
      className={`bg-white rounded-2xl border ${
        selected ? "border-gold" : "border-line"
      } shadow-card overflow-hidden transition-colors`}
    >
      {/* Gradient placeholder for image */}
      <div className="h-44 relative bg-gradient-to-br from-cream2 to-line">
        {service.badge && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] bg-ink/85 text-cream rounded-full px-2.5 py-1">
            {service.badge}
          </span>
        )}
        <span className="absolute bottom-3 right-3 mono text-[10px] text-mute bg-cream/90 rounded px-2 py-1">
          photo &middot; {service.nom.toLowerCase().replace(/\s/g, "-")}.jpg
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-serif text-[20px] text-ink leading-tight">
              {service.nom}
            </p>
            <p className="text-[12px] text-mute mt-1 flex items-center gap-2">
              {service.etoiles && (
                <span className="text-gold tracking-widest">
                  {"★".repeat(service.etoiles)}
                </span>
              )}
              {service.etoiles && service.quartier && (
                <span className="inline-block w-1 h-1 rounded-full bg-mute/30" />
              )}
              {service.quartier && <span>{service.quartier}</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="figure text-[17px] text-ink">
              {fmt(service.prixBase)}
            </p>
            <p className="text-[10px] text-mute">{t("per_night")}</p>
          </div>
        </div>
        <div className="border-t border-line my-4" />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={selected}
              onChange={onSelect}
              className="accent-gold w-4 h-4"
            />
            {t("select")}
          </label>
          <div className="flex items-center gap-2 text-[12px] text-mute">
            <span>{t("nights")}</span>
            <div className={selected ? "" : "opacity-40 pointer-events-none"}>
              <QtyStepper
                value={selected ? nights : defaultNights}
                onChange={onNightsChange}
                min={1}
                max={14}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
