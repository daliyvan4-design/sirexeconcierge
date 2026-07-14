interface AikoLogoProps {
  dark?: boolean;
  className?: string;
  height?: number;
}

export function AikoLogo({
  dark = false,
  height = 44,
  className = "",
}: AikoLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <span
        className={`font-serif font-bold tracking-[0.08em] ${dark ? "text-gold" : "text-ink"}`}
        style={{ fontSize: height * 0.7, lineHeight: 1 }}
      >
        AIKO
      </span>
      <span
        className={`uppercase tracking-[0.3em] font-medium ${dark ? "text-cream/50" : "text-mute"}`}
        style={{ fontSize: height * 0.16 }}
      >
        board
      </span>
    </div>
  );
}
