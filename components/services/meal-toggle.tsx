"use client";

import { useTranslations } from "next-intl";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { fmt } from "@/lib/utils";
import type { ServiceItem } from "./types";

interface MealToggleProps {
  service: ServiceItem;
  on: boolean;
  onToggle: () => void;
  isFirst: boolean;
}

export function MealToggle({ service, on, onToggle, isFirst }: MealToggleProps) {
  const t = useTranslations("s3");
  const Icon = require("lucide-react")[
    service.icon
      ? service.icon.replace(/(^|-)([a-z])/g, (_: string, __: string, c: string) => c.toUpperCase())
      : "Utensils"
  ];

  return (
    <div
      className={`flex items-center gap-4 p-5 ${
        !isFirst ? "border-t border-line" : ""
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-cream2 flex items-center justify-center shrink-0">
        {Icon ? <Icon size={18} className="text-ink" /> : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[17px] text-ink">{service.nom}</p>
        {service.description && (
          <p className="text-[12px] text-mute">{service.description}</p>
        )}
      </div>
      <p className="figure text-[15px] text-ink mr-4 hidden sm:block">
        {service.prixBase === 0
          ? t("included")
          : `${fmt(service.prixBase)} ${t("per_pax")}`}
      </p>
      <ToggleSwitch on={on} onToggle={onToggle} />
    </div>
  );
}
