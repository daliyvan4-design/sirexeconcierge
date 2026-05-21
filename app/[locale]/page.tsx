import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-5 py-16">
      <h1 className="font-serif text-[48px] text-ink">{t("tagline")}</h1>
      <p className="text-mute mt-4">{t("lead")}</p>
      <div className="flex gap-4 mt-8">
        <a href="/fr" className="text-gold">FR</a>
        <a href="/en" className="text-gold">EN</a>
        <a href="/ar" className="text-gold">AR</a>
      </div>
    </div>
  );
}
