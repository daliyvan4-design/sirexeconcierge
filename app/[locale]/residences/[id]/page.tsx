"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Navigation,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
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
  contactNom: string | null;
  contactTel: string | null;
  contactEmail: string | null;
  images: ResidenceImage[];
  tarifs: ResidenceTarif[];
}

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR");
}

export default function ResidenceDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const id = params.id as string;

  const [residence, setResidence] = useState<Residence | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    fetch(`/api/residences/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setResidence(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!residence) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-mute text-[16px]">Residence introuvable</p>
        <Link href={`/${locale}/residences`} className="text-gold mt-4 inline-block">Retour</Link>
      </div>
    );
  }

  const equipList = residence.equipements?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const images = residence.images;
  const minPrice = residence.tarifs.length > 0 ? Math.min(...residence.tarifs.map((t) => t.prixParNuit)) : null;

  return (
    <section className="animate-fade-up">
      <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-10 pb-24">
        <Link href={`/${locale}/residences`} className="text-[13px] text-mute hover:text-ink flex items-center gap-1.5 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Toutes les residences
        </Link>

        {images.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden mb-8 group">
            <img
              src={images[imgIdx].url}
              alt={images[imgIdx].legende ?? residence.nom}
              className="w-full aspect-[16/9] object-cover cursor-pointer"
              onClick={() => setShowFullscreen(true)}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-ink/60 text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-ink/60 text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-gold w-4" : "bg-cream/60"}`}
                    />
                  ))}
                </div>
                <span className="absolute top-3 right-3 text-[11px] bg-ink/60 text-cream rounded-full px-3 py-1">
                  {imgIdx + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        )}

        {images.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setImgIdx(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === imgIdx ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif text-[32px] sm:text-[40px] text-ink">{residence.nom}</h1>
                <span className="text-[11px] uppercase tracking-wider text-gold bg-gold/10 rounded-full px-3 py-1 font-medium">
                  {residence.type}
                </span>
              </div>
              <p className="text-[14px] text-mute flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {residence.adresse}{residence.quartier ? `, ${residence.quartier}` : ""} · {residence.ville}
              </p>
            </div>

            {residence.description && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-3">Description</h3>
                <p className="text-[14px] text-ink/80 leading-relaxed">{residence.description}</p>
              </div>
            )}

            {equipList.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-3">Equipements</h3>
                <div className="flex flex-wrap gap-2">
                  {equipList.map((eq) => (
                    <span key={eq} className="text-[12px] bg-cream2 border border-line rounded-full px-4 py-1.5 text-ink">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {residence.tarifs.length > 0 && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-3">Tarifs</h3>
                <div className="space-y-3">
                  {residence.tarifs.map((t) => (
                    <div key={t.id} className="bg-cream2 border border-line rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-ink">{t.label}</p>
                        <p className="text-[12px] text-mute mt-0.5">
                          {t.typeChambre} · {t.capacite} personne{t.capacite > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[18px] font-serif font-bold text-gold">{formatPrice(t.prixParNuit)}</p>
                        <p className="text-[11px] text-mute">{t.devise} / nuit</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {residence.latitude && residence.longitude && (
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-mute mb-3">Localisation</h3>
                <div className="bg-cream2 border border-line rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${residence.longitude - 0.01}%2C${residence.latitude - 0.01}%2C${residence.longitude + 0.01}%2C${residence.latitude + 0.01}&layer=mapnik&marker=${residence.latitude}%2C${residence.longitude}`}
                    className="w-full h-[300px] border-0"
                    title="Carte"
                  />
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-[12px] text-mute">{residence.adresse}, {residence.ville}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${residence.latitude},${residence.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] text-gold hover:underline font-medium"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Itineraire
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-ink text-cream rounded-2xl p-6 sticky top-6">
              {minPrice && (
                <div className="mb-4">
                  <p className="text-[11px] text-cream/40 uppercase tracking-wider">A partir de</p>
                  <p className="font-serif text-[32px] text-gold">
                    {formatPrice(minPrice)}
                    <span className="text-[14px] text-cream/40 ml-1">XOF / nuit</span>
                  </p>
                </div>
              )}

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center gap-2 text-cream/70">
                  <Bed className="w-4 h-4 text-gold" />
                  <span>{residence.capacite} chambres disponibles</span>
                </div>
                {residence.contactNom && (
                  <div className="flex items-center gap-2 text-cream/70">
                    <User className="w-4 h-4 text-gold" />
                    <span>{residence.contactNom}</span>
                  </div>
                )}
                {residence.contactTel && (
                  <a href={`tel:${residence.contactTel}`} className="flex items-center gap-2 text-cream/70 hover:text-cream">
                    <Phone className="w-4 h-4 text-gold" />
                    <span>{residence.contactTel}</span>
                  </a>
                )}
                {residence.contactEmail && (
                  <a href={`mailto:${residence.contactEmail}`} className="flex items-center gap-2 text-cream/70 hover:text-cream">
                    <Mail className="w-4 h-4 text-gold" />
                    <span>{residence.contactEmail}</span>
                  </a>
                )}
              </div>

              {residence.contactTel && (
                <a
                  href={`tel:${residence.contactTel}`}
                  className="mt-6 w-full btn-press inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-6 py-3.5 text-[14px] font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Contacter
                </a>
              )}

              {residence.latitude && residence.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${residence.latitude},${residence.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full btn-press inline-flex items-center justify-center gap-2 border border-cream/20 text-cream rounded-full px-6 py-3 text-[13px] font-medium hover:bg-cream/10"
                >
                  <Navigation className="w-4 h-4" />
                  Voir l&apos;itineraire
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-cream/60 hover:text-cream text-[24px]"
            onClick={() => setShowFullscreen(false)}
          >
            ×
          </button>
          <img
            src={images[imgIdx].url}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-cream/10 text-cream rounded-full flex items-center justify-center hover:bg-cream/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-cream/10 text-cream rounded-full flex items-center justify-center hover:bg-cream/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
