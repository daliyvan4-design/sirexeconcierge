import { CarFront, BedDouble, Utensils, Sparkles } from "lucide-react";

const CATS = [
  { key: "transport", label: "Transport", icon: CarFront, color: "bg-ink" },
  { key: "hebergement", label: "Hébergement", icon: BedDouble, color: "bg-gold" },
  { key: "repas", label: "Repas", icon: Utensils, color: "bg-ok" },
  { key: "extras", label: "Extras", icon: Sparkles, color: "bg-mining" },
];

interface BreakdownBarsProps {
  data: { categorie: string; montant: number; pourcentage: number }[];
}

export function BreakdownBars({ data }: BreakdownBarsProps) {
  return (
    <div className="space-y-4">
      {CATS.map((cat) => {
        const item = data.find((d) => d.categorie === cat.key);
        const pct = item?.pourcentage || 0;
        return (
          <div key={cat.key}>
            <div className="flex items-center justify-between text-[13px] mb-1">
              <span className="flex items-center gap-2 text-ink">
                <cat.icon size={14} className="text-gold" />
                {cat.label}
              </span>
              <span className="mono text-mute">{pct}%</span>
            </div>
            <div className="h-2 bg-cream rounded-full overflow-hidden">
              <div className={`h-full ${cat.color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
