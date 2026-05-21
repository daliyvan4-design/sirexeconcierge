import { useTranslations } from "next-intl";

const DAYS = ["day1", "day2", "day3", "day4"] as const;

export function ProgrammeGrid() {
  const t = useTranslations("sa");

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
      {DAYS.map((day) => (
        <div key={day} className="bg-cream p-6">
          <p className="text-[36px] font-semibold text-ink leading-none tabular-nums">
            {t(`${day}.date` as any)}
            <span className="text-[18px] text-mute font-normal">
              {" "}
              {t(`${day}.date_s` as any)}
            </span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold mt-2">
            {t(`${day}.lbl` as any)}
          </p>
          <div className="h-px bg-line my-4" />
          <p className="font-serif text-[17px] text-ink leading-snug">
            {t(`${day}.h` as any)}
          </p>
          <p className="text-[12px] text-mute mt-2">
            {t(`${day}.d` as any)}
          </p>
        </div>
      ))}
    </div>
  );
}
