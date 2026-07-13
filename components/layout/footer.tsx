"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { AikoLogo } from "@/components/brand/aiko-logo";

export function Footer() {
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream border-t border-cream/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <AikoLogo dark height={32} />
            <p className="mt-4 text-[13px] text-cream/50 leading-relaxed max-w-md">
              Plateforme de gestion événementielle complète. Billetterie, badges,
              hébergement, paiement mobile et conciergerie — tout en un.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.15em] text-gold mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2 text-[13px] text-cream/50">
              <li>
                <Link href={`/${locale}#creer`} className="hover:text-cream transition-colors">
                  Créer un événement
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/residences`} className="hover:text-cream transition-colors">
                  Résidences
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:text-cream transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.15em] text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-[13px] text-cream/50">
              <li>
                <a href="mailto:contact@aikoevent.com" className="hover:text-cream transition-colors">
                  contact@aikoevent.com
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-cream transition-colors">
                  Espace admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/30">
            © {year} AÏKO Event & Tech. Tous droits réservés.
          </p>
          <p className="text-[11px] text-cream/30">
            Conçu en Afrique de l&apos;Ouest
          </p>
        </div>
      </div>
    </footer>
  );
}
