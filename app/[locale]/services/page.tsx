import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ServiceBlock } from "@/components/editorial/service-block";

const BLOCKS = [
  { number: "01", titleKey: "t1.h", descKey: "t1.d", priceKey: "t1.price", reversed: true },
  { number: "02", titleKey: "t2.h", descKey: "t2.d", priceKey: "t2.price", reversed: false },
  { number: "03", titleKey: "t3.h", descKey: "t3.d", priceKey: "t3.price", reversed: true },
  { number: "04", titleKey: "t4.h", descKey: "t4.d", priceKey: "t4.price", reversed: false },
];

export default function ServicesPage() {
  const t = useTranslations("sv");
  const locale = useLocale();

  return (
    <section className="animate-fade-up">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 lg:pt-24 pb-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mute mb-12">
          <span className="dot bg-gold" />
          <span>{t("eye")}</span>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-24">
          <div className="lg:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.32em] text-mute mb-6">
              {t("k")}
            </p>
            <h1 className="font-serif text-[48px] sm:text-[64px] lg:text-[76px] leading-[1.02] text-ink">
              {t.rich("h", {
                highlight: (chunks) => (
                  <em className="text-gold not-italic">{chunks}</em>
                ),
              })}
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[15px] text-mute leading-relaxed max-w-md">
              {t("lead")}
            </p>
            <div className="h-px bg-line my-6" />
            <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-mute">
              <span>{t("count")}</span>
              <span>{t("updated")}</span>
            </div>
          </div>
        </div>

        {/* Service blocks */}
        <div className="space-y-24">
          {BLOCKS.map((block) => (
            <ServiceBlock key={block.number} {...block} />
          ))}
        </div>

        {/* Closing CTA */}
        <div className="h-px bg-line mt-24 mb-10" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-mute">
              {t("cta.k")}
            </p>
            <h3 className="font-serif text-[32px] sm:text-[40px] text-ink leading-tight mt-3 max-w-xl">
              {t("cta.h")}
            </h3>
          </div>
          <Link
            href={`/${locale}/reservation`}
            className="btn-press inline-flex items-center justify-center gap-2.5 bg-ink hover:bg-ink2 text-cream rounded-full px-7 py-3.5 text-[14px] font-medium"
          >
            {t("cta.h")} <span className="flip-rtl">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
