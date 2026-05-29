import Image from "next/image";

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
  const imgHeight = height;
  const imgWidth = Math.round(imgHeight * (2821 / 720));

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <Image
        src="/assets/logo-sirexe.webp"
        alt="SIREXE"
        width={imgWidth}
        height={imgHeight}
        className={`object-contain ${dark ? "brightness-0 invert" : ""}`}
        style={{ height, width: "auto" }}
        priority
      />
      <span
        className={`uppercase tracking-[0.35em] font-medium ${dark ? "text-cream/60" : "text-ink/50"}`}
        style={{ fontSize: height * 0.22, marginTop: height * -0.04 }}
      >
        aïko
      </span>
    </div>
  );
}
