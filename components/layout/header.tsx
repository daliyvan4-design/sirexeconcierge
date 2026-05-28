"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LangSwitcher } from "./lang-switcher";
import { SirexeLogo } from "@/components/brand/sirexe-logo";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <header className="bg-ink text-cream sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[68px] flex items-center justify-between">
        <Link href={`/${locale}`}>
          <SirexeLogo dark height={38} />
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
