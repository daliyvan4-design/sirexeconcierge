"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Printer,
  Download,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

const EVENTS: Record<string, {
  name: string;
  type: "conference" | "concert";
  date: string;
  lieu: string;
  description: string;
  participants: number;
  badgePrice: number;
  ticketPrice: number;
}> = {
  "salon-tech-2026": {
    name: "Salon Tech Abidjan 2026",
    type: "conference",
    date: "11 — 17 mars 2026",
    lieu: "Sofitel Hôtel Ivoire · Abidjan",
    description: "Le rendez-vous annuel de la tech et de l&apos;innovation en Afrique de l&apos;Ouest. Conférences, B2B, networking.",
    participants: 850,
    badgePrice: 0,
    ticketPrice: 0,
  },
  "afro-music-festival": {
    name: "Afro Music Festival",
    type: "concert",
    date: "22 — 24 avril 2026",
    lieu: "Palais de la Culture · Abidjan",
    description: "3 jours de musique live — Afrobeats, Coupé-Décalé, Amapiano. 20+ artistes internationaux.",
    participants: 3200,
    badgePrice: 0,
    ticketPrice: 15000,
  },
  "summit-mines-energie": {
    name: "Summit Mines & Énergie",
    type: "conference",
    date: "5 — 7 mai 2026",
    lieu: "Radisson Blu · Abidjan",
    description: "Forum international sur les ressources extractives et énergétiques en Côte d&apos;Ivoire.",
    participants: 420,
    badgePrice: 0,
    ticketPrice: 0,
  },
  "hackathon-ci": {
    name: "Hackathon CI 2026",
    type: "conference",
    date: "15 — 16 juin 2026",
    lieu: "Ivoirienne de Tech · Cocody",
    description: "48h de code non-stop. Thèmes : FinTech, HealthTech, AgriTech. Prix : 5M XOF.",
    participants: 200,
    badgePrice: 5000,
    ticketPrice: 0,
  },
};

function genRef() {
  return `AIKO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export default function EventPage() {
  const params = useParams();
  const locale = useLocale();
  const eventId = params.id as string;
  const event = EVENTS[eventId];

  const [step, setStep] = useState<"info" | "form" | "done">("info");
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    organisation: "",
    useForBadge: true,
  });
  const [ref] = useState(genRef);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-mute text-[16px]">Événement introuvable</p>
        <Link href={`/${locale}`} className="text-gold mt-4 inline-block">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const isConcert = event.type === "concert";
  const price = isConcert ? event.ticketPrice : event.badgePrice;
  const isFree = price === 0;

  if (step === "done") {
    return (
      <section className="animate-fade-up">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 pt-10 pb-24">
          <div className="text-center mb-12">
            <CheckCircle2 className="w-16 h-16 text-ok mx-auto mb-5" />
            <h2 className="font-serif text-[36px] sm:text-[44px] text-ink">
              {isConcert ? "Ticket confirmé" : "Accréditation confirmée"}
            </h2>
            <p className="text-mute mt-3 text-[16px] max-w-lg mx-auto">
              {form.prenom}, votre {isConcert ? "ticket" : "badge"} pour <strong>{event.name}</strong> est prêt.
              Présentez le QR code à l&apos;entrée.
            </p>
          </div>

          {/* Badge / Ticket */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-[380px] bg-ink rounded-2xl overflow-hidden shadow-float" id="badge-print">
              <div className="bg-gold px-6 py-4 flex items-center justify-between">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>
                  AÏKO
                </span>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#0A0A0A", fontWeight: 600 }}>
                  {isConcert ? "Ticket" : "Badge"}
                </span>
              </div>

              <div className="px-6 pt-5 pb-3">
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", lineHeight: 1.2 }}>
                  {form.prenom} {form.nom}
                </p>
                {form.organisation && (
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{form.organisation}</p>
                )}
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />

              <div className="px-6 py-4">
                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Événement</p>
                <p style={{ fontSize: 15, color: "#C8A951", fontWeight: 600, marginTop: 4 }}>{event.name}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{event.date}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{event.lieu}</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />

              <div className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Référence</p>
                  <p style={{ fontSize: 14, color: "#C8A951", fontWeight: 600, marginTop: 2, fontFamily: "monospace" }}>{ref}</p>
                </div>
                {isConcert && (
                  <div className="text-right">
                    <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Prix</p>
                    <p style={{ fontSize: 14, color: "#fff", fontWeight: 500, marginTop: 2 }}>{new Intl.NumberFormat("fr-FR").format(price)} XOF</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                <QRCodeSVG
                  value={JSON.stringify({
                    ref,
                    event: event.name,
                    name: `${form.prenom} ${form.nom}`,
                    email: form.email,
                    type: isConcert ? "ticket" : "badge",
                    date: event.date,
                  })}
                  size={150}
                  bgColor="transparent"
                  fgColor="#C8A951"
                  level="M"
                />
              </div>

              <div className="px-6 pb-4 text-center">
                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>
                  Scannez avec l&apos;app AÏKO · {isConcert ? "Ticket numérique" : "Accréditation"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById("badge-print");
                  if (!el) return;
                  const w = window.open("", "_blank", "width=420,height=700");
                  if (!w) return;
                  w.document.write(`<!DOCTYPE html><html><head><title>${isConcert ? "Ticket" : "Badge"} AÏKO — ${ref}</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}@media print{body{margin:0;padding:0}}</style></head><body>${el.innerHTML}<script>window.onload=function(){window.print();window.close()}<\/script></body></html>`);
                  w.document.close();
                }}
                className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-6 py-3 text-[14px] font-semibold"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("badge-print");
                  if (!el) return;
                  const w = window.open("", "_blank", "width=420,height=700");
                  if (!w) return;
                  w.document.write(`<!DOCTYPE html><html><head><title>${isConcert ? "Ticket" : "Badge"} AÏKO — ${ref}</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}</style></head><body>${el.innerHTML}</body></html>`);
                  w.document.close();
                }}
                className="btn-press inline-flex items-center gap-2 bg-ink hover:bg-ink2 text-cream rounded-full px-6 py-3 text-[14px] font-medium"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href={`/${locale}`} className="text-[14px] text-gold hover:text-gold2 font-medium">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-up">
      <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-10 pb-24">
        {/* Back */}
        <Link href={`/${locale}`} className="text-[13px] text-mute hover:text-ink flex items-center gap-1.5 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour aux événements
        </Link>

        {/* Event header */}
        <div className="bg-ink text-cream rounded-2xl p-8 sm:p-10 mb-8">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-cream/40 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>{isConcert ? "Concert" : "Conférence"}</span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[44px] text-cream leading-tight">
            {event.name}
          </h1>
          <p className="text-cream/50 text-[15px] mt-4 max-w-xl">{event.description}</p>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold" />
              <div>
                <p className="text-[12px] text-cream/40">Date</p>
                <p className="text-[14px] text-cream font-medium">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold" />
              <div>
                <p className="text-[12px] text-cream/40">Lieu</p>
                <p className="text-[14px] text-cream font-medium">{event.lieu}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gold" />
              <div>
                <p className="text-[12px] text-cream/40">Participants</p>
                <p className="text-[14px] text-cream font-medium">{event.participants} inscrits</p>
              </div>
            </div>
          </div>
        </div>

        {step === "info" && (
          <div className="text-center py-8">
            <button
              onClick={() => setStep("form")}
              className="btn-press inline-flex items-center gap-3 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[16px] font-semibold"
            >
              {isConcert ? (
                <>
                  <Ticket className="w-5 h-5" />
                  Acheter mon ticket — {new Intl.NumberFormat("fr-FR").format(price)} XOF
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  {isFree ? "S&apos;inscrire gratuitement" : `S&apos;inscrire — ${new Intl.NumberFormat("fr-FR").format(price)} XOF`}
                </>
              )}
            </button>
          </div>
        )}

        {step === "form" && (
          <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-10 animate-fade-up">
            <h2 className="font-serif text-[26px] text-ink mb-2">
              {isConcert ? "Acheter votre ticket" : "Inscription"}
            </h2>
            <p className="text-mute text-[14px] mb-8">
              Remplissez vos informations pour obtenir votre {isConcert ? "ticket numérique" : "badge d&apos;accréditation"}.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("done");
              }}
              className="grid md:grid-cols-2 gap-x-8 gap-y-6"
            >
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Prénom</label>
                <input
                  required
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  placeholder="Amadou"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Nom</label>
                <input
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Diallo"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="amadou@exemple.com"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Téléphone</label>
                <input
                  required
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  placeholder="+225 07 12 34 56 78"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px] mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Organisation / Entreprise</label>
                <input
                  value={form.organisation}
                  onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                  placeholder="Optionnel"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>

              {/* Use for badge checkbox */}
              <div className="md:col-span-2 border-t border-line pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.useForBadge}
                    onChange={(e) => setForm({ ...form, useForBadge: e.target.checked })}
                    className="accent-gold w-5 h-5 mt-0.5"
                  />
                  <div>
                    <p className="text-[14px] text-ink font-medium">
                      Utiliser ces données pour mon {isConcert ? "ticket" : "accréditation"}
                    </p>
                    <p className="text-[12px] text-mute mt-1">
                      Vos informations seront imprimées sur votre {isConcert ? "ticket numérique" : "badge"} avec un QR code vérifiable.
                    </p>
                  </div>
                </label>
              </div>

              {!isFree && (
                <div className="md:col-span-2 bg-cream2 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] text-ink font-medium">
                        {isConcert ? "Ticket" : "Badge"} — {event.name}
                      </p>
                      <p className="text-[12px] text-mute mt-1">
                        {isConcert ? "Commission AÏKO 10% incluse" : "Frais d&apos;identification AÏKO 10 € inclus"}
                      </p>
                    </div>
                    <p className="font-serif text-[28px] text-ink">{new Intl.NumberFormat("fr-FR").format(price)} <span className="text-[14px] text-mute">XOF</span></p>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold"
                >
                  {isFree ? "Obtenir mon badge" : `Payer & obtenir mon ${isConcert ? "ticket" : "badge"}`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
