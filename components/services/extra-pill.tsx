"use client";

import { fmt } from "@/lib/utils";
import type { ServiceItem } from "./types";

interface ExtraPillProps {
  service: ServiceItem;
  active: boolean;
  onToggle: () => void;
}

export function ExtraPill({ service, active, onToggle }: ExtraPillProps) {
  const Icon = require("lucide-react")[
    service.icon
      ? service.icon.replace(/(^|-)([a-z])/g, (_: string, __: string, c: string) => c.toUpperCase())
      : "Sparkles"
  ];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-medium transition-colors ${
        active
          ? "border-gold bg-gold/10 text-ink"
          : "border-line bg-white text-ink hover:border-ink/20"
      }`}
    >
      {Icon ? <Icon size={16} /> : null}
      <span>{service.nom}</span>
      <span className="figure text-[12px] text-mute">{fmt(service.prixBase)}</span>
    </button>
  );
}
