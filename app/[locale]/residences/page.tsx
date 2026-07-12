"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Wifi,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

interface ResidenceImage {
  id: string;
  url: string;
  legende: string | null;
}

interface ResidenceTarif {
  id: string;
  label: string;
  typeChambre: string;
  prixParNuit: number;
  devise: string;
  capacite: number;
}

interface Residence {
  id: string;
  nom: string;
  type: string;
  description: string | null;
  adresse: string;
  ville: string;
  quartier: string | null;
  latitude: number | null;
  longitude: number | null;
  capacite: number;
  equipements: string | null;
  images: ResidenceImage[];
  tarifs: ResidenceTarif[];
}

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR");
}

function ImageCarousel({ images }: { images: ResidenceImage[] }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-line rounded-t-2xl flex items-center justify-center">
        <Bed className="w-10 h-10 text-mute" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-ink rounded-t-2xl overflow-hidden group">
      <img
        src={images[idx].url}
        alt={images[idx].legende ?? ""}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); setIdx((idx - 1 + images.length) % images.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-ink/60 text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setIdx((idx + 1) % images.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-ink/60 text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === idx ? "bg-gold" : "bg-cream/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ResidencesPublicPage() {
  const locale = useLocale();
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/residences")
      .then((r) => r.json())
      .then((d) => { if (d.success) setResidences(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="animate-fade-up">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-10 pb-24">
        <Link href={`/${locale}`} className="text-[13px] text-mute hover:text-ink flex items-center gap-1.5 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <h1 className="font-serif text-[32px] sm:text-[40px] text-ink mb-2">
          R{"é"}sidences disponibles
        </h1>
        <p className="text-mute text-[14px] mb-10">
          D{"é"}couvrez nos h{"é"}bergements partenaires pour vos {"é"}v{"é"}nements
        </p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-cream2 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-line" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-line rounded w-3/4" />
                  <div className="h-4 bg-line rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : residences.length === 0 ? (
          <div className="text-center py-20">
            <Bed className="w-12 h-12 text-mute mx-auto mb-4" />
            <p className="text-mute text-[14px]">Aucune r{"é"}sidence disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {residences.map((r) => {
              const equipList = r.equipements?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
              const minPrice = r.tarifs.length > 0 ? Math.min(...r.tarifs.map((t) => t.prixParNuit)) : null;

              return (
                <Link key={r.id} href={`/${locale}/residences/${r.id}`} className="bg-cream2 border border-line rounded-2xl overflow-hidden hover:shadow-float transition-shadow block">
                  <ImageCarousel images={r.images} />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-[16px] font-semibold text-ink">{r.nom}</h3>
                        <p className="text-[12px] text-mute flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {r.quartier ? `${r.quartier}, ` : ""}{r.ville}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-gold bg-gold/10 rounded-full px-2 py-1 font-medium flex-shrink-0">
                        {r.type}
                      </span>
                    </div>

                    {r.description && (
                      <p className="text-[12px] text-mute mt-2 line-clamp-2">{r.description}</p>
                    )}

                    {equipList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {equipList.slice(0, 4).map((eq) => (
                          <span key={eq} className="text-[10px] bg-white border border-line rounded-full px-2 py-0.5 text-ink">
                            {eq}
                          </span>
                        ))}
                        {equipList.length > 4 && (
                          <span className="text-[10px] text-mute">+{equipList.length - 4}</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
                      <span className="text-[12px] text-mute flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        {r.capacite} chambres
                      </span>
                      {minPrice ? (
                        <span className="text-[14px] font-semibold text-ink">
                          {formatPrice(minPrice)} <span className="text-[10px] text-mute font-normal">XOF / nuit</span>
                        </span>
                      ) : (
                        <span className="text-[12px] text-mute">Prix sur demande</span>
                      )}
                    </div>

                    {r.tarifs.length > 1 && (
                      <div className="mt-3 space-y-1.5">
                        {r.tarifs.map((t) => (
                          <div key={t.id} className="flex items-center justify-between text-[11px]">
                            <span className="text-mute">{t.label} · {t.typeChambre} · {t.capacite} pers.</span>
                            <span className="text-ink font-medium">{formatPrice(t.prixParNuit)} XOF</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {r.latitude && r.longitude && (
                      <span
                        className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-gold"
                      >
                        <Navigation className="w-3 h-3" />
                        Voir l&apos;itin{"é"}raire
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
