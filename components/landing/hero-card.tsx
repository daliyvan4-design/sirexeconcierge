import { useTranslations } from "next-intl";

const ARRIVALS = [
  { flag: "🇬🇭", name: "S. Mensah", flight: "KP 022", time: "08:15", dayKey: "arr.tomorrow" },
  { flag: "🇦🇪", name: "K. Al-Faisal", flight: "EK 787", time: "14:30", dayKey: "arr.tomorrow" },
  { flag: "🇲🇦", name: "F. Bensalah", flight: "AT 552", time: "11:20", dayKey: "arr.friday" },
];

export function HeroCard() {
  const t = useTranslations();

  return (
    <div className="rounded-[4px] overflow-hidden relative bg-ink">
      {/* Sky region */}
      <div className="relative aspect-[5/4]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 75% 10%, rgba(201,168,76,.18), transparent 60%), linear-gradient(180deg, #1A1A2E 0%, #0F0F1C 100%)",
          }}
        />

        {/* Crescent moon */}
        <svg className="absolute" style={{ top: 36, right: 36 }} width="40" height="40" viewBox="0 0 64 64" fill="none">
          <path d="M52 32a22 22 0 1 1-22-22 16 16 0 0 0 22 22z" fill="#C9A84C" />
        </svg>

        {/* Plane + trajectory */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" fill="none" preserveAspectRatio="xMidYMid meet">
          <path d="M-10 230 C 90 200, 200 110, 410 80" stroke="#C9A84C" strokeWidth="0.8" strokeDasharray="2 6" opacity=".45" />
          <g transform="translate(248 124) rotate(-18)" opacity=".95">
            <path d="M0 0 L14 -3 L20 -7 L24 -7 L20 -1 L32 -2 L36 0 L32 2 L20 1 L24 7 L20 7 L14 3 Z" fill="#F8F7F4" />
          </g>
        </svg>

        {/* Skyline */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 90" preserveAspectRatio="none">
          <g fill="#0A0A14">
            <rect x="0" y="55" width="54" height="35" />
            <rect x="54" y="35" width="30" height="55" />
            <rect x="84" y="48" width="42" height="42" />
            <rect x="126" y="14" width="22" height="76" />
            <rect x="148" y="28" width="30" height="62" />
            <rect x="178" y="50" width="46" height="40" />
            <rect x="224" y="22" width="22" height="68" />
            <rect x="246" y="8" width="18" height="82" />
            <rect x="264" y="36" width="36" height="54" />
            <rect x="300" y="26" width="24" height="64" />
            <rect x="324" y="50" width="30" height="40" />
            <rect x="354" y="38" width="46" height="52" />
          </g>
          <g fill="#C9A84C" opacity=".55">
            <rect x="66" y="46" width="2" height="2" />
            <rect x="132" y="30" width="2" height="2" />
            <rect x="250" y="22" width="2" height="2" />
            <rect x="308" y="40" width="2" height="2" />
          </g>
        </svg>

        {/* Corner caption */}
        <div className="absolute top-6 left-6 text-cream/55 text-[10px] tracking-[0.3em] uppercase mono">
          <p>{t("s1.hero.city")}</p>
          <p className="mt-1">{t("s1.hero.coord")}</p>
        </div>
      </div>

      {/* Arrivals panel */}
      <div className="bg-cream text-ink px-6 pt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] tracking-[0.28em] uppercase text-mute">
            {t("s1.hero.arrivals")}
          </p>
          <span className="text-[10px] mono text-mute flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok" />
            {t("s1.hero.realtime")}
          </span>
        </div>
        <div className="divide-y divide-line">
          {ARRIVALS.map((a) => (
            <div key={a.flight} className="flex items-center gap-4 py-2.5">
              <span className="text-[18px] leading-none">{a.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-ink leading-tight">{a.name}</p>
                <p className="text-[10px] text-mute mono tracking-[0.12em]">
                  {t("arr.flight")} {a.flight} · {t(a.dayKey as any)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] text-ink figure">{a.time}</p>
                <p className="text-[10px] text-mute mono">{t("arr.airport")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer stripe */}
      <div className="bg-ink2 text-cream/55 text-[10px] mono tracking-[0.18em] uppercase flex items-center justify-between px-6 py-3">
        <span>{t("s1.hero.event")}</span>
        <span>{t("s1.hero.dates")}</span>
      </div>
    </div>
  );
}
