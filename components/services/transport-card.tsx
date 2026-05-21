"use client";

import { useTranslations } from "next-intl";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { fmt } from "@/lib/utils";
import type { ServiceItem } from "./types";

interface TransportCardProps {
  service: ServiceItem;
  qty: number;
  onQtyChange: (v: number) => void;
}

export function TransportCard({ service, qty, onQtyChange }: TransportCardProps) {
  const t = useTranslations("s3");
  const Icon = require("lucide-react")[
    service.icon
      ? service.icon.replace(/(^|-)([a-z])/g, (_: string, __: string, c: string) => c.toUpperCase())
      : "Car"
  ];

  return (
    <div
      className={`bg-white rounded-2xl border ${
        qty > 0 ? "border-gold" : "border-line"
      } shadow-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 transition-colors`}
    >
      <div className="w-14 h-14 rounded-xl bg-cream2 flex items-center justify-center shrink-0">
        {Icon ? <Icon size={22} className="text-ink" /> : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-serif text-[19px] text-ink">{service.nom}</p>
          {service.badge === "popular" && (
            <span className="text-[10px] uppercase tracking-[0.18em] bg-gold/15 text-gold2 rounded-full px-2 py-0.5">
              {t("popular")}
            </span>
          )}
        </div>
        {service.description && (
          <p className="text-[13px] text-mute mt-1">{service.description}</p>
        )}
      </div>
      <div className="flex items-center gap-5 sm:gap-7">
        <div className="text-right">
          <p className="figure text-[17px] text-ink">{fmt(service.prixBase)}</p>
        </div>
        <QtyStepper value={qty} onChange={onQtyChange} />
      </div>
    </div>
  );
}
