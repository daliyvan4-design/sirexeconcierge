import { useTranslations } from "next-intl";

export function TrustStrip() {
  const t = useTranslations();

  return (
    <>
      <div className="hr mt-24 mb-6" />
      <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[12px] text-mute">
        <span>{t("s1.trust.stripe")}</span>
        <span className="text-ink/15">|</span>
        <span>{t("s1.trust.momo")}</span>
        <span className="text-ink/15">|</span>
        <span>{t("s1.trust.support")}</span>
        <span className="ml-auto text-[11px] tracking-[0.2em] uppercase">
          {t("s1.trust.avg")}
        </span>
      </div>
    </>
  );
}
