"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { PaymentMethodPicker, type MethodChoice } from "@/components/payment/payment-method-picker";
import { PaymentButton } from "@/components/payment/payment-button";
import { generateTicketPDF } from "@/lib/generate-ticket-pdf";
import { EventMap } from "@/components/ui/event-map";

interface EventData {
  slug: string;
  nom: string;
  type: string;
  description: string;
  organisateur: string;
  lieu: string;
  ville: string;
  dateDebut: string;
  dateFin: string;
  capacite: number;
  badgePayant: boolean;
  prixBadge: number;
  ticketPayant: boolean;
  prixTicket: number;
  latitude?: number;
  longitude?: number;
  _count: { participants: number };
}

const DEMO_EVENTS: Record<string, EventData> = {
  "salon-tech-2026": {
    slug: "salon-tech-2026",
    nom: "Salon Tech Abidjan 2026",
    type: "conference",
    description: "Le rendez-vous annuel de la tech et de l'innovation en Afrique de l'Ouest. Conferences, B2B, networking.",
    organisateur: "AIKO Events",
    lieu: "Sofitel Hotel Ivoire",
    ville: "Abidjan",
    dateDebut: "2026-03-11",
    dateFin: "2026-03-17",
    capacite: 1000,
    badgePayant: false,
    prixBadge: 0,
    ticketPayant: false,
    prixTicket: 0,
    latitude: 5.3364,
    longitude: -4.0267,
    _count: { participants: 850 },
  },
  "afro-music-festival": {
    slug: "afro-music-festival",
    nom: "Afro Music Festival",
    type: "concert",
    description: "3 jours de musique live — Afrobeats, Coupe-Decale, Amapiano. 20+ artistes internationaux.",
    organisateur: "AfroBeat Productions",
    lieu: "Palais de la Culture",
    ville: "Abidjan",
    dateDebut: "2026-04-22",
    dateFin: "2026-04-24",
    capacite: 5000,
    badgePayant: false,
    prixBadge: 0,
    ticketPayant: true,
    prixTicket: 15000,
    latitude: 5.3189,
    longitude: -3.9735,
    _count: { participants: 3200 },
  },
  "summit-mines-energie": {
    slug: "summit-mines-energie",
    nom: "Summit Mines & Energie",
    type: "conference",
    description: "Forum international sur les ressources extractives et energetiques en Cote d'Ivoire.",
    organisateur: "Ministere des Mines",
    lieu: "Radisson Blu",
    ville: "Abidjan",
    dateDebut: "2026-05-05",
    dateFin: "2026-05-07",
    capacite: 500,
    badgePayant: false,
    prixBadge: 0,
    ticketPayant: false,
    prixTicket: 0,
    latitude: 5.3599,
    longitude: -3.9912,
    _count: { participants: 420 },
  },
  "hackathon-ci": {
    slug: "hackathon-ci",
    nom: "Hackathon CI 2026",
    type: "conference",
    description: "48h de code non-stop. Themes : FinTech, HealthTech, AgriTech. Prix : 5M XOF.",
    organisateur: "Ivoirienne de Tech",
    lieu: "Ivoirienne de Tech",
    ville: "Cocody",
    dateDebut: "2026-06-15",
    dateFin: "2026-06-16",
    capacite: 250,
    badgePayant: true,
    prixBadge: 5000,
    ticketPayant: false,
    prixTicket: 0,
    latitude: 5.3490,
    longitude: -3.9830,
    _count: { participants: 200 },
  },
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return `${s.toLocaleDateString("fr-FR", { day: "numeric" })} — ${e.toLocaleDateString("fr-FR", opts)}`;
}

export default function EventPage() {
  const params = useParams();
  const locale = useLocale();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventData | null>(DEMO_EVENTS[eventId] ?? null);
  const [loading, setLoading] = useState(!DEMO_EVENTS[eventId]);

  const [step, setStep] = useState<"info" | "form" | "done">("info");
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    organisation: "",
    useForBadge: true,
  });
  const [ref, setRef] = useState("");
  const [ticketNum, setTicketNum] = useState(0);
  const [payMethod, setPayMethod] = useState<MethodChoice | null>(null);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (DEMO_EVENTS[eventId]) return;
    fetch(`/api/events/${eventId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEvent(d.data);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-mute text-[16px]">Evenement introuvable</p>
        <Link href={`/${locale}`} className="text-gold mt-4 inline-block">
          Retour
        </Link>
      </div>
    );
  }

  const isConcert = event.type === "concert";
  const price = isConcert ? event.prixTicket : event.prixBadge;
  const isFree = price === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFree) return;

    try {
      const res = await fetch(`/api/events/${event.slug}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          organisation: form.organisation,
          type: isConcert ? "ticket" : "badge",
          montant: 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRef(data.data.reference);
        setTicketNum(data.data.ticketNumber);
      } else {
        setRef(`AIKO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      }
    } catch {
      setRef(`AIKO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    }

    setStep("done");
  };

  const saveParticipantBeforePay = async (): Promise<{ participantRef?: string; eventSlug?: string }> => {
    try {
      const res = await fetch(`/api/events/${event.slug}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          organisation: form.organisation,
          type: isConcert ? "ticket" : "badge",
          statut: "pending",
          montant: price,
        }),
      });
      const data = await res.json();
      if (data.success) {
        return { participantRef: data.data.reference, eventSlug: event.slug };
      }
    } catch {
      // continue to payment anyway
    }
    return { eventSlug: event.slug };
  };

  if (step === "done") {
    const displayRef = ref || `AIKO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return (
      <section className="animate-fade-up">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 pt-10 pb-24">
          <div className="text-center mb-12">
            <CheckCircle2 className="w-16 h-16 text-ok mx-auto mb-5" />
            <h2 className="font-serif text-[36px] sm:text-[44px] text-ink">
              {isConcert ? "Ticket confirme" : "Accreditation confirmee"}
            </h2>
            <p className="text-mute mt-3 text-[16px] max-w-lg mx-auto">
              {form.prenom}, votre {isConcert ? "ticket" : "badge"} pour <strong>{event.nom}</strong> est pret.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="w-[380px] bg-ink rounded-2xl overflow-hidden shadow-float" id="badge-print">
              <div className="bg-gold px-6 py-4 flex items-center justify-between">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>
                  AIKO
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
                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Evenement</p>
                <p style={{ fontSize: 15, color: "#C8A951", fontWeight: 600, marginTop: 4 }}>{event.nom}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{formatDateRange(event.dateDebut, event.dateFin)}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{event.lieu} · {event.ville}</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />

              <div className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Reference</p>
                  <p style={{ fontSize: 14, color: "#C8A951", fontWeight: 600, marginTop: 2, fontFamily: "monospace" }}>{displayRef}</p>
                </div>
                {isConcert && ticketNum > 0 && (
                  <div className="text-right">
                    <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Ticket N°</p>
                    <p style={{ fontSize: 18, color: "#fff", fontWeight: 700, marginTop: 2, fontFamily: "monospace" }}>
                      {String(ticketNum).padStart(4, "0")}
                    </p>
                  </div>
                )}
                {!isConcert && (
                  <div className="text-right">
                    <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>N°</p>
                    <p style={{ fontSize: 14, color: "#fff", fontWeight: 500, marginTop: 2 }}>{String(ticketNum || 1).padStart(4, "0")}</p>
                  </div>
                )}
              </div>

              {!isFree && (
                <>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />
                  <div className="px-6 py-2">
                    <div className="flex items-center justify-between">
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Montant</p>
                      <p style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{new Intl.NumberFormat("fr-FR").format(price)} XOF</p>
                    </div>
                  </div>
                </>
              )}

              <div className="px-6 py-5 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                <QRCodeSVG
                  value={JSON.stringify({
                    ref: displayRef,
                    event: event.nom,
                    name: `${form.prenom} ${form.nom}`,
                    email: form.email,
                    type: isConcert ? "ticket" : "badge",
                    ticket: ticketNum,
                  })}
                  size={150}
                  bgColor="transparent"
                  fgColor="#C8A951"
                  level="M"
                />
              </div>

              <div className="px-6 pb-4 text-center">
                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>
                  Scannez avec AIKO · {isConcert ? "Ticket numerique" : "Accreditation"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById("badge-print");
                  if (!el) return;
                  const w = window.open("", "_blank", "width=420,height=750");
                  if (!w) return;
                  w.document.write(`<!DOCTYPE html><html><head><title>${isConcert ? "Ticket" : "Badge"} AIKO — ${displayRef}</title><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh}@media print{body{margin:0;padding:0}}</style></head><body>${el.innerHTML}<script>window.onload=function(){window.print()}<\/script></body></html>`);
                  w.document.close();
                }}
                className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-6 py-3 text-[14px] font-semibold"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={() => {
                  const svgEl = document.querySelector("#badge-print svg") as SVGSVGElement | null;
                  if (!svgEl) return;
                  const canvas = document.createElement("canvas");
                  canvas.width = 300;
                  canvas.height = 300;
                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;
                  const svgData = new XMLSerializer().serializeToString(svgEl);
                  const img = new Image();
                  img.onload = () => {
                    ctx.fillStyle = "#0A0A0A";
                    ctx.fillRect(0, 0, 300, 300);
                    ctx.drawImage(img, 0, 0, 300, 300);
                    const qrDataUrl = canvas.toDataURL("image/png");
                    const pdf = generateTicketPDF({
                      eventName: event.nom,
                      eventDate: formatDateRange(event.dateDebut, event.dateFin),
                      eventLieu: `${event.lieu} · ${event.ville}`,
                      participantName: `${form.prenom} ${form.nom}`,
                      email: form.email,
                      reference: displayRef,
                      ticketNumber: ticketNum || 1,
                      price,
                      qrDataUrl,
                    });
                    pdf.save(`${isConcert ? "ticket" : "badge"}-${displayRef}.pdf`);
                  };
                  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
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
              ← Retour
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-up">
      <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-10 pb-24">
        <Link href={`/${locale}`} className="text-[13px] text-mute hover:text-ink flex items-center gap-1.5 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour aux evenements
        </Link>

        <div className="bg-ink text-cream rounded-2xl p-8 sm:p-10 mb-8">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-cream/40 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span>{isConcert ? "Concert" : "Conference"}</span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[44px] text-cream leading-tight">
            {event.nom}
          </h1>
          <p className="text-cream/50 text-[15px] mt-4 max-w-xl">{event.description}</p>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold" />
              <div>
                <p className="text-[12px] text-cream/40">Date</p>
                <p className="text-[14px] text-cream font-medium">{formatDateRange(event.dateDebut, event.dateFin)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold" />
              <div>
                <p className="text-[12px] text-cream/40">Lieu</p>
                <p className="text-[14px] text-cream font-medium">{event.lieu} · {event.ville}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gold" />
              <div>
                <p className="text-[12px] text-cream/40">Participants</p>
                <p className="text-[14px] text-cream font-medium">{event._count.participants} inscrits</p>
              </div>
            </div>
          </div>
        </div>

        {event.latitude && event.longitude && (
          <div className="mb-8">
            <EventMap
              lat={event.latitude}
              lng={event.longitude}
              lieu={event.lieu}
              ville={event.ville}
            />
          </div>
        )}

        {step === "info" && (
          <div className="text-center py-8">
            <button
              onClick={() => setStep("form")}
              className="btn-press inline-flex items-center gap-3 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[16px] font-semibold"
            >
              {isConcert ? (
                <>
                  <Ticket className="w-5 h-5" />
                  {isFree ? "Obtenir mon ticket" : `Acheter mon ticket — ${new Intl.NumberFormat("fr-FR").format(price)} XOF`}
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
              Remplissez vos informations pour obtenir votre {isConcert ? "ticket numerique" : "badge"}.
            </p>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Prenom</label>
                <input required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Amadou" className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Nom</label>
                <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Diallo" className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="amadou@exemple.com" className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Telephone</label>
                <input required value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+225 07 12 34 56 78" className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px] mono" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Organisation / Entreprise</label>
                <input value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} placeholder="Optionnel" className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]" />
              </div>

              <div className="md:col-span-2 border-t border-line pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.useForBadge} onChange={(e) => setForm({ ...form, useForBadge: e.target.checked })} className="accent-gold w-5 h-5 mt-0.5" />
                  <div>
                    <p className="text-[14px] text-ink font-medium">
                      Utiliser ces donnees pour mon {isConcert ? "ticket" : "accreditation"}
                    </p>
                    <p className="text-[12px] text-mute mt-1">
                      Vos informations seront imprimees sur votre {isConcert ? "ticket numerique" : "badge"} avec un QR code verifiable.
                    </p>
                  </div>
                </label>
              </div>

              {!isFree && (
                <div className="md:col-span-2 bg-cream2 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[14px] text-ink font-medium">
                        {isConcert ? "Ticket" : "Badge"} — {event.nom}
                      </p>
                      <p className="text-[12px] text-mute mt-1">
                        {isConcert ? "Commission AIKO 10% incluse" : "Frais AIKO 10 EUR inclus"}
                      </p>
                    </div>
                    <p className="font-serif text-[28px] text-ink">{new Intl.NumberFormat("fr-FR").format(price)} <span className="text-[14px] text-mute">XOF</span></p>
                  </div>
                </div>
              )}

              {!isFree && (
                <div className="md:col-span-2">
                  <PaymentMethodPicker value={payMethod} onChange={setPayMethod} />
                </div>
              )}

              {payError && (
                <div className="md:col-span-2 bg-err/10 border border-err/20 text-err rounded-xl px-4 py-3 text-[13px]">
                  {payError}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end pt-2">
                {isFree ? (
                  <button type="submit" className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold">
                    Obtenir mon {isConcert ? "ticket" : "badge"}
                  </button>
                ) : (
                  <PaymentButton
                    amount={price}
                    method={payMethod}
                    description={`${isConcert ? "Ticket" : "Badge"} — ${event.nom}`}
                    customerName={`${form.prenom} ${form.nom}`}
                    customerEmail={form.email}
                    customerPhone={form.telephone}
                    eventSlug={event.slug}
                    type={isConcert ? "ticket" : "badge"}
                    onBeforePay={saveParticipantBeforePay}
                    onError={setPayError}
                    disabled={!form.prenom || !form.nom || !form.email}
                    label={`Payer ${new Intl.NumberFormat("fr-FR").format(price)} XOF`}
                  />
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
