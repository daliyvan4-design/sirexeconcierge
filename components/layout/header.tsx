"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LangSwitcher } from "./lang-switcher";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <header className="bg-ink text-cream sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[68px] flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3.5">
          <span className="flex items-center gap-[3px]">
            <span className="dot bg-mining" />
            <span className="dot bg-cream/80" />
            <span className="dot bg-energy" />
          </span>
          <span className="font-serif text-cream text-[17px] tracking-wide">
            Sirexe<span className="text-gold">.</span>Concierge
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[12px] tracking-wide text-cream/55">
          <Link href={`/${locale}/services`} className="hover:text-cream transition-colors">
            {t("nav.services")}
          </Link>
          <Link href={`/${locale}/salon`} className="hover:text-cream transition-colors">
            {t("nav.salon")}
          </Link>
          <Link href={`/${locale}/assistance`} className="hover:text-cream transition-colors">
            {t("nav.assistance")}
          </Link>
        </nav>

        <LangSwitcher />
      </div>
    </header>
  );
}
