"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function EchecContent() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";

  return (
    <section className="animate-fade-up">
      <div className="max-w-xl mx-auto px-5 py-32 text-center">
        <XCircle className="w-20 h-20 text-err mx-auto mb-6" />
        <h1 className="font-serif text-[40px] text-ink mb-4">
          Paiement echoue
        </h1>
        <p className="text-mute text-[16px] mb-2">
          Le paiement n&apos;a pas pu etre traite. Aucun montant n&apos;a ete debite.
        </p>
        {ref && (
          <p className="text-[14px] text-mute mb-4">
            Reference : <span className="font-mono text-mute font-semibold">{ref}</span>
          </p>
        )}
        <p className="text-[13px] text-mute mb-8">
          Vous pouvez reessayer ou choisir un autre mode de paiement.
        </p>

        <Link
          href={`/${locale}`}
          className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold"
        >
          Retour
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default function EchecPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <EchecContent />
    </Suspense>
  );
}
