"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Calendar, Users, Ticket, QrCode, Plus, ArrowRight, Loader2 } from "lucide-react";

const PRICING = [
  { label: "Création d&apos;événement", price: "50 €", sub: "Accès organisateur complet" },
  { label: "Frais d&apos;identification", price: "10 €", sub: "Par badge payant délivré" },
  { label: "Tickets concert", price: "10%", sub: "Commission sur chaque vente" },
];

interface EventItem {
  slug: string;
  nom: string;
  type: string;
  lieu: string;
  ville: string;
  dateDebut: string;
  dateFin: string;
  prixBadge: number;
  prixTicket: number;
  _count: { participants: number };
}

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} — ${e.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}

function EventCard({ evt, locale, variant }: { evt: EventItem; locale: string; variant: "dark" | "light" }) {
  const price = evt.prixTicket || evt.prixBadge;
  const typeLabel = evt.type === "concert" ? "Concert" : evt.type === "hackathon" ? "Tech" : "Conférence";

  if (variant === "dark") {
    return (
      <Link
        href={`/${locale}/evenement/${evt.slug}`}
        className="bg-cream/[0.04] border border-cream/[0.08] rounded-2xl p-5 hover:bg-cream/[0.08] hover:border-cream/[0.15] transition-all group"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-gold/10 text-gold">
            <Calendar size={18} />
          </span>
          <span className="text-[10px] uppercase tracking-wider text-cream/30">{typeLabel}</span>
        </div>
        <h3 className="font-serif text-[17px] text-cream leading-tight mb-2 group-hover:text-gold transition-colors">
          {evt.nom}
        </h3>
        <p className="text-[12px] text-cream/40">{formatRange(evt.dateDebut, evt.dateFin)}</p>
        <p className="text-[11px] text-cream/30 mt-1">{evt.lieu} · {evt.ville}</p>
        <div className="mt-4 pt-3 border-t border-cream/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-cream/40 mono">{evt._count.participants} inscrits</span>
          <span className="text-[11px] text-gold font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            S&apos;inscrire <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/evenement/${evt.slug}`}
      className="bg-white border border-line rounded-2xl p-6 hover:shadow-float transition-all group"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold/10 text-gold">
          <Calendar size={20} />
        </span>
        <span className="text-[10px] uppercase tracking-wider text-mute bg-cream2 px-2 py-1 rounded-full">
          {typeLabel}
        </span>
      </div>
      <h3 className="font-serif text-[18px] text-ink leading-tight mb-2 group-hover:text-gold transition-colors">
        {evt.nom}
      </h3>
      <p className="text-[13px] text-mute">{formatRange(evt.dateDebut, evt.dateFin)}</p>
      <p className="text-[12px] text-mute/60 mt-1">{evt.lieu} · {evt.ville}</p>
      <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
        <span className="text-[12px] text-mute mono">{evt._count.participants} participants</span>
        <span className="text-[12px] text-gold font-medium">
          {price === 0 ? "Gratuit" : `${new Intl.NumberFormat("fr-FR").format(price)} XOF`}
        </span>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const locale = useLocale();
  const [tab, setTab] = useState<"participer" | "creer">("participer");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) setEvents(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="animate-fade-up">
      {/* Hero */}
      <div className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-20 lg:pt-28 pb-20">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-cream/40 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>Plateforme événementielle</span>
          </div>

          <h1 className="font-serif text-[44px] sm:text-[60px] lg:text-[80px] leading-[1.02] font-normal max-w-4xl">
            Créez, participez,{" "}
            <em className="text-gold not-italic">badgez</em>.
          </h1>
          <p className="mt-8 text-[17px] text-cream/60 max-w-xl leading-relaxed">
            AÏKO Event & Tech permet aux organisateurs de créer leur événement en quelques minutes
            et aux participants d&apos;obtenir leur badge ou ticket avec QR code — lisible avec notre application.
          </p>

          {/* Tabs */}
          <div className="mt-14 inline-flex bg-cream/5 border border-cream/10 rounded-full p-1">
            <button
              onClick={() => setTab("participer")}
              className={`rounded-full px-6 py-3 text-[14px] font-medium transition-all ${
                tab === "participer"
                  ? "bg-gold text-ink"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2 -mt-0.5" />
              Participer à un événement
            </button>
            <button
              onClick={() => setTab("creer")}
              className={`rounded-full px-6 py-3 text-[14px] font-medium transition-all ${
                tab === "creer"
                  ? "bg-gold text-ink"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2 -mt-0.5" />
              Créer votre événement
            </button>
          </div>

          {/* Tab content */}
          <div className="mt-10">
            {tab === "participer" && (
              <div className="animate-fade-up">
                <p className="text-cream/50 text-[14px] mb-6">
                  Choisissez votre événement ci-dessous pour vous inscrire et obtenir votre badge ou ticket.
                </p>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-gold animate-spin" />
                  </div>
                ) : events.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {events.map((evt) => (
                      <EventCard key={evt.slug} evt={evt} locale={locale} variant="dark" />
                    ))}
                  </div>
                ) : (
                  <p className="text-cream/30 text-[14px] py-8 text-center">Aucun événement pour le moment</p>
                )}
              </div>
            )}

            {tab === "creer" && (
              <div className="animate-fade-up max-w-2xl">
                <p className="text-cream/50 text-[14px] mb-6">
                  Créez votre événement en quelques minutes. Conférence, salon, concert, hackathon —
                  nous générons les badges et tickets pour vos participants.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-cream/[0.04] border border-cream/[0.08] rounded-2xl p-5 text-center">
                    <Calendar className="w-8 h-8 text-gold mx-auto mb-3" />
                    <p className="text-[13px] text-cream font-medium">Créez l&apos;événement</p>
                    <p className="text-[11px] text-cream/40 mt-1">Nom, dates, logo, lieu</p>
                  </div>
                  <div className="bg-cream/[0.04] border border-cream/[0.08] rounded-2xl p-5 text-center">
                    <QrCode className="w-8 h-8 text-gold mx-auto mb-3" />
                    <p className="text-[13px] text-cream font-medium">Badges & tickets</p>
                    <p className="text-[11px] text-cream/40 mt-1">QR code pour chaque participant</p>
                  </div>
                  <div className="bg-cream/[0.04] border border-cream/[0.08] rounded-2xl p-5 text-center">
                    <Ticket className="w-8 h-8 text-gold mx-auto mb-3" />
                    <p className="text-[13px] text-cream font-medium">Gérez les entrées</p>
                    <p className="text-[11px] text-cream/40 mt-1">Scan avec notre app</p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/creer`}
                  className="btn-press inline-flex items-center gap-2.5 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold"
                >
                  Créer mon événement — 50 €
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events en cours */}
      <div id="participer" className="max-w-7xl mx-auto px-5 lg:px-10 py-20">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mute mb-10">
          <span className="dot bg-gold" />
          <span>Événements en cours</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-mute animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map((evt) => (
              <EventCard key={evt.slug} evt={evt} locale={locale} variant="light" />
            ))}
          </div>
        ) : (
          <p className="text-mute text-[14px] py-8 text-center">Aucun événement publié pour le moment.</p>
        )}
      </div>

      {/* Pricing */}
      <div id="tarifs" className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-cream/40 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>Tarifs</span>
          </div>

          <h2 className="font-serif text-[36px] sm:text-[48px] text-cream mb-12">
            Un modèle <em className="text-gold not-italic">simple</em>.
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.map((p) => (
              <div key={p.label} className="bg-cream/[0.04] border border-cream/[0.08] rounded-2xl p-8">
                <p className="text-[12px] uppercase tracking-wider text-cream/40 mb-4">{p.label}</p>
                <p className="font-serif text-[48px] text-gold leading-none">{p.price}</p>
                <p className="text-[13px] text-cream/50 mt-3">{p.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-[13px] text-cream/30 mt-8">
            Badges gratuits = aucun frais. Tickets concerts = 10% prélevé automatiquement.
          </p>
        </div>
      </div>
    </section>
  );
}
