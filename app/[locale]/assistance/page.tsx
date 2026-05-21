import { useTranslations } from "next-intl";
import { ChannelCard } from "@/components/editorial/channel-card";
import { FaqAccordion } from "@/components/editorial/faq-accordion";

const FAQ_ITEMS = [
  { questionKey: "q1", answerKey: "a1" },
  { questionKey: "q2", answerKey: "a2" },
  { questionKey: "q3", answerKey: "a3" },
  { questionKey: "q4", answerKey: "a4" },
  { questionKey: "q5", answerKey: "a5" },
  { questionKey: "q6", answerKey: "a6" },
];

export default function AssistancePage() {
  const t = useTranslations("as");

  return (
    <section className="animate-fade-up">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 lg:pt-24 pb-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mute mb-12">
          <span className="w-2 h-2 rounded-full bg-ok" />
          <span>{t("eye")}</span>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-20">
          <div className="lg:col-span-8">
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
          <div className="lg:col-span-4">
            <p className="text-[15px] text-mute leading-relaxed">
              {t.rich("lead", {
                strong: (chunks) => (
                  <strong className="text-ink">{chunks}</strong>
                ),
              })}
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-4 mb-12">
          <span className="text-[10px] uppercase tracking-[0.22em] text-ok">
            {t("online")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-mute">
            {t("h247")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-mute">
            {t("under2h")}
          </span>
        </div>

        {/* 3 Channel cards */}
        <div className="grid md:grid-cols-3 gap-px bg-line mb-20">
          <ChannelCard
            channelKey="ch1"
            statusBadge={t("online")}
            badgeColor="text-ok"
            iconBg="rgba(46,125,82,.1)"
          />
          <ChannelCard
            channelKey="ch2"
            statusBadge={t("h247")}
            iconBg="rgba(201,168,76,.1)"
          />
          <ChannelCard
            channelKey="ch3"
            statusBadge={t("under2h")}
            iconBg="rgba(26,26,46,.05)"
          />
        </div>

        {/* Emergency strip */}
        <div className="bg-ink text-cream rounded-[4px] p-8 sm:p-10 mb-20 grid sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold mb-3">
              {t("emer.k")}
            </p>
            <h3 className="font-serif text-[28px] sm:text-[32px] leading-tight">
              {t("emer.h")}
            </h3>
            <p className="text-[13px] text-cream/65 mt-3 max-w-md">
              {t("emer.d")}
            </p>
          </div>
          <div className="sm:col-span-5 sm:text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
              {t("emer.sub")}
            </p>
            <p className="text-[32px] sm:text-[40px] font-semibold tabular-nums text-gold mt-2">
              {t("emer.num")}
            </p>
            <p className="text-[11px] font-mono text-cream/45 mt-1">
              {t("emer.sub2")}
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="grid lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-mute mb-4">
              {t("faq.k")}
            </p>
            <h2 className="font-serif text-[36px] sm:text-[44px] text-ink leading-tight">
              {t("faq.h")}
            </h2>
            <p className="text-[14px] text-mute mt-5 max-w-sm">
              {t("faq.lead")}
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>

        {/* Footer info */}
        <div className="h-px bg-line mb-10" />
        <div className="grid sm:grid-cols-3 gap-8 text-[13px]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
              {t("office.lbl")}
            </p>
            <p className="text-ink leading-relaxed whitespace-pre-line">
              {t("office.addr")}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
              {t("lang.lbl")}
            </p>
            <p className="text-ink">{t("lang.main")}</p>
            <p className="text-mute mt-2">{t("lang.extra")}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
              {t("cov.lbl")}
            </p>
            <p className="text-ink">{t("cov.dates")}</p>
            <p className="text-mute mt-2">{t("cov.h")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
