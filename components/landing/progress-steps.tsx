import { useTranslations } from "next-intl";

export function ProgressSteps({ current = 1 }: { current?: number }) {
  const t = useTranslations();
  const steps = [
    { num: 1, label: t("s1.step.you") },
    { num: 2, label: t("s1.step.services") },
    { num: 3, label: t("s1.step.payment") },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        {steps.map((s, i) => (
          <span key={s.num} className="contents">
            <span
              className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[12px] font-semibold ${
                s.num <= current
                  ? "bg-ink text-cream"
                  : "bg-cream2 text-ink/40"
              }`}
            >
              {s.num}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`h-[2px] flex-1 ${
                  s.num < current ? "bg-ink/30" : "bg-ink/10"
                }`}
              />
            )}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 mt-3 text-[10px] uppercase tracking-[0.22em]">
        {steps.map((s) => (
          <span
            key={s.num}
            className={`${s.num === 1 ? "text-ink" : "text-mute"} ${
              s.num === 2 ? "text-center" : s.num === 3 ? "text-right" : ""
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
