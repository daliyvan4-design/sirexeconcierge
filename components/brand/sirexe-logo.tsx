interface SirexeLogoProps {
  dark?: boolean;
  className?: string;
  height?: number;
}

export function SirexeLogo({
  dark = false,
  height = 44,
  className = "",
}: SirexeLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <span
        className={`font-serif font-bold tracking-[0.08em] ${dark ? "text-gold" : "text-ink"}`}
        style={{ fontSize: height * 0.7, lineHeight: 1 }}
      >
        AÏKO
      </span>
      <span
        className={`uppercase tracking-[0.3em] font-medium ${dark ? "text-cream/50" : "text-mute"}`}
        style={{ fontSize: height * 0.16 }}
      >
        event & tech
      </span>
    </div>
  );
}
