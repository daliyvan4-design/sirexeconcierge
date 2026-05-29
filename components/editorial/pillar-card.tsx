import { useTranslations } from "next-intl";

const COLORS: Record<string, string> = {
  mining: "#E87722",
  oil: "#0F1C0F",
  energy: "#2E7D52",
};

const ICONS: Record<string, React.ReactNode> = {
  mining: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 20 L9 8 L13 14 L16 10 L21 20 Z" fill="#fff" />
    </svg>
  ),
  oil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 C 7 11, 7 16, 12 21 C 17 16, 17 11, 12 3 Z"
        fill="#fff"
      />
    </svg>
  ),
  energy: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2 L4 14 L11 14 L9 22 L20 10 L13 10 Z"
        fill="#fff"
      />
    </svg>
  ),
};

interface PillarCardProps {
  color: "mining" | "oil" | "energy";
  labelKey: string;
  titleKey: string;
  descKey: string;
  statsKey: string;
}

export function PillarCard({
  color,
  labelKey,
  titleKey,
  descKey,
  statsKey,
}: PillarCardProps) {
  const t = useTranslations("sa");

  return (
    <div className="bg-cream p-8">
      <div className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: COLORS[color] }}
        >
          {ICONS[color]}
        </span>
        <p className="text-[11px] uppercase tracking-[0.22em] text-mute">
          {t(labelKey as any)}
        </p>
      </div>
      <h3 className="font-serif text-[28px] text-ink mt-5 leading-tight">
        {t(titleKey as any)}
      </h3>
      <p className="text-[14px] text-mute mt-3 leading-relaxed">
        {t(descKey as any)}
      </p>
      <div className="h-px bg-line my-5" />
      <p className="text-[11px] font-mono text-mute tracking-wide">
        {t(statsKey as any)}
      </p>
    </div>
  );
}
