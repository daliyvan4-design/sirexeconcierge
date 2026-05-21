import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { PillarCard } from "@/components/editorial/pillar-card";
import { ProgrammeGrid } from "@/components/editorial/programme-grid";

export default function SalonPage() {
  const t = useTranslations("sa");
  const locale = useLocale();

  return (
    <section className="animate-fade-up">
      {/* Dark banner */}
      <div className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-cream/50 mb-8">
                <span className="dot bg-gold" />
                <span>{t("eye")}</span>
              </div>
              <h1 className="font-serif text-[52px] sm:text-[72px] lg:text-[96px] leading-[0.98] text-cream tracking-tight">
                SIREXE<br />
                <span className="text-gold">2026</span>
              </h1>
              <p className="font-serif italic text-[20px] text-cream/70 mt-6 max-w-xl">
                {t("tag")}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-6 text-cream">
                {/* Dates */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    {t("f.dates")}
                  </p>
                  <p className="text-[28px] font-semibold tabular-nums mt-1">
                    {t("f.dates_v")}
                  </p>
                  <p className="text-[11px] font-mono text-cream/45 mt-1">
                    {t("f.days")}
                  </p>
                </div>
                {/* Lieu */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    {t("f.loc")}
                  </p>
                  <p className="font-serif text-[20px] mt-1 leading-tight">
                    {t("f.loc_v")}
                  </p>
                  <p className="text-[11px] font-mono text-cream/45 mt-1">
                    {t("f.loc_sub")}
                  </p>
                </div>
                {/* Exposants */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    {t("f.exp")}
                  </p>
                  <p className="text-[28px] font-semibold tabular-nums mt-1">
                    {t("f.exp_v")}
                  </p>
                  <p className="text-[11px] font-mono text-cream/45 mt-1">
                    {t("f.exp_sub")}
                  </p>
                </div>
                {/* Visiteurs */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    {t("f.vis")}
                  </p>
                  <p className="text-[28px] font-semibold tabular-nums mt-1">
                    {t("f.vis_v")}
                  </p>
                  <p className="text-[11px] font-mono text-cream/45 mt-1">
                    {t("f.vis_sub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three pillars */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-20 pb-12">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mute mb-12">
          <span className="dot bg-gold" />
          <span>{t("pillars")}</span>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-line">
          <PillarCard
            color="mining"
            labelKey="p1.lbl"
            titleKey="p1.h"
            descKey="p1.d"
            statsKey="p1.s"
          />
          <PillarCard
            color="oil"
            labelKey="p2.lbl"
            titleKey="p2.h"
            descKey="p2.d"
            statsKey="p2.s"
          />
          <PillarCard
            color="energy"
            labelKey="p3.lbl"
            titleKey="p3.h"
            descKey="p3.d"
            statsKey="p3.s"
          />
        </div>
      </div>

      {/* Programme */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mute mb-12">
          <span className="dot bg-gold" />
          <span>{t("prog")}</span>
        </div>
        <ProgrammeGrid />
      </div>

      {/* Patronage strip */}
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-mute mb-3">
                {t("pat.lbl")}
              </p>
              <p className="font-serif text-[22px] text-ink leading-tight whitespace-pre-line">
                {t("pat.org")}
              </p>
              <p className="text-[12px] text-mute mt-2">
                {t("pat.country")}
              </p>
            </div>
            <div className="bg-cream2 border border-line p-6 rounded-[4px]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold mb-2">
                {t("conc.lbl")}
              </p>
              <p className="font-serif text-[20px] text-ink leading-tight">
                {t("conc.h")}
              </p>
              <Link
                href={`/${locale}/reservation`}
                className="text-[12px] uppercase tracking-[0.2em] text-ink mt-4 hover:text-gold2 inline-flex items-center gap-2"
              >
                {t("conc.cta")} <span className="flip-rtl">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
