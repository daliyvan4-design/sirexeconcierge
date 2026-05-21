import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { HeroCard } from "@/components/landing/hero-card";
import { ProgressSteps } from "@/components/landing/progress-steps";
import { TrustStrip } from "@/components/landing/trust-strip";

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="animate-fade-up">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 lg:pt-24 pb-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mute mb-14">
          <span className="dot bg-gold" />
          <span>{t("tagline")}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left: Copy + CTA */}
          <div className="lg:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.32em] text-mute mb-7">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-[48px] sm:text-[64px] lg:text-[80px] leading-[1.02] text-ink font-normal">
              {t.rich("h1", {
                highlight: (chunks) => (
                  <em className="text-gold not-italic font-normal">{chunks}</em>
                ),
              })}
            </h1>
            <p className="mt-8 text-[16px] text-mute max-w-lg leading-relaxed">
              {t("lead")}
            </p>

            <div className="mt-14 max-w-sm">
              <ProgressSteps current={1} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-12">
              <Link
                href={`/${locale}/reservation`}
                className="btn-press inline-flex items-center justify-center gap-2.5 bg-ink hover:bg-ink2 text-cream rounded-full px-7 py-3.5 text-[14px] font-medium tracking-wide"
              >
                <span>{t("cta_start")}</span>
                <span className="flip-rtl">→</span>
              </Link>
              <button className="btn-press inline-flex items-center justify-center gap-2 text-ink rounded-full px-6 py-3.5 text-[14px] font-medium hover:text-gold2">
                <span>{t("cta_concierge")}</span>
              </button>
            </div>
          </div>

          {/* Right: Hero card */}
          <div className="lg:col-span-5">
            <HeroCard />
          </div>
        </div>

        <TrustStrip />
      </div>
    </section>
  );
}
