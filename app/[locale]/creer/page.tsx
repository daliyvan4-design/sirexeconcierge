"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Calendar,
  MapPin,
  Users,
  Ticket,
  QrCode,
  CheckCircle2,
  Copy,
  ExternalLink,
  Mic,
  Music,
  Building2,
  Code2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PaymentMethodPicker, type MethodChoice } from "@/components/payment/payment-method-picker";
import { PaymentButton } from "@/components/payment/payment-button";

type EventType = "conference" | "concert" | "salon" | "hackathon";

interface EventForm {
  name: string;
  type: EventType;
  description: string;
  dateStart: string;
  dateEnd: string;
  lieu: string;
  ville: string;
  capacite: string;
  badgePayant: boolean;
  prixBadge: string;
  ticketPayant: boolean;
  prixTicket: string;
  contactEmail: string;
  contactTel: string;
  organisateur: string;
}

const EVENT_TYPES: { value: EventType; label: string; icon: LucideIcon }[] = [
  { value: "conference", label: "Conférence", icon: Mic },
  { value: "concert", label: "Concert", icon: Music },
  { value: "salon", label: "Salon / Expo", icon: Building2 },
  { value: "hackathon", label: "Hackathon", icon: Code2 },
];

function genEventId() {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

export default function CreerPage() {
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EventForm>({
    name: "",
    type: "conference",
    description: "",
    dateStart: "",
    dateEnd: "",
    lieu: "",
    ville: "",
    capacite: "",
    badgePayant: false,
    prixBadge: "",
    ticketPayant: false,
    prixTicket: "",
    contactEmail: "",
    contactTel: "",
    organisateur: "",
  });
  const [eventId] = useState(genEventId);

  const [payMethod, setPayMethod] = useState<MethodChoice | null>(null);
  const [payError, setPayError] = useState("");

  const update = (patch: Partial<EventForm>) => setForm({ ...form, ...patch });
  const isConcert = form.type === "concert";

  if (step === 4) {
    const eventUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${locale}/evenement/${eventId}`;

    return (
      <section className="animate-fade-up">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 pt-10 pb-24">
          <div className="text-center mb-12">
            <CheckCircle2 className="w-16 h-16 text-ok mx-auto mb-5" />
            <h2 className="font-serif text-[36px] sm:text-[44px] text-ink">
              Événement créé !
            </h2>
            <p className="text-mute mt-3 text-[16px] max-w-lg mx-auto">
              <strong>{form.name}</strong> est en ligne. Partagez le lien avec vos participants.
            </p>
          </div>

          {/* Event summary card */}
          <div className="w-[380px] mx-auto bg-ink rounded-2xl overflow-hidden shadow-float mb-8">
            <div className="bg-gold px-6 py-4 flex items-center justify-between">
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>
                AÏKO
              </span>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#0A0A0A", fontWeight: 600 }}>
                Organisateur
              </span>
            </div>

            <div className="px-6 pt-5 pb-3">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", lineHeight: 1.2 }}>
                {form.name}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{form.organisateur}</p>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />

            <div className="px-6 py-4">
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {form.dateStart} → {form.dateEnd}
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                {form.lieu} · {form.ville}
              </p>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />

            <div className="px-6 py-5 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
              <QRCodeSVG
                value={eventUrl}
                size={150}
                bgColor="transparent"
                fgColor="#C8A951"
                level="M"
              />
            </div>

            <div className="px-6 pb-4 text-center">
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>
                QR Code de l&apos;événement
              </p>
            </div>
          </div>

          {/* Link share */}
          <div className="bg-cream2 border border-line rounded-2xl p-5 mb-8">
            <p className="text-[12px] uppercase tracking-wider text-mute mb-3">Lien d&apos;inscription participants</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={eventUrl}
                className="flex-1 bg-white border border-line rounded-xl px-4 py-3 text-[14px] mono"
              />
              <button
                onClick={() => navigator.clipboard?.writeText(eventUrl)}
                className="btn-press bg-ink text-cream rounded-xl px-4 py-3"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="bg-cream2 border border-line rounded-2xl p-5 mb-8">
            <p className="text-[12px] uppercase tracking-wider text-mute mb-3">Récapitulatif facturation</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-ink">Création d&apos;événement</span>
                <span className="text-[14px] text-ink font-semibold">50 €</span>
              </div>
              {form.badgePayant && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-mute">Frais d&apos;identification badge</span>
                  <span className="text-[14px] text-mute">10 € / badge</span>
                </div>
              )}
              {isConcert && form.ticketPayant && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-mute">Commission tickets</span>
                  <span className="text-[14px] text-mute">10% / vente</span>
                </div>
              )}
              <div className="border-t border-line pt-3 flex items-center justify-between">
                <span className="text-[14px] text-ink font-medium">Total dû maintenant</span>
                <span className="font-serif text-[24px] text-ink">50 €</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/evenement/${eventId}`}
              className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Voir la page de mon événement
            </Link>
            <Link href={`/${locale}`} className="text-[14px] text-mute hover:text-ink">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-up">
      <div className="max-w-3xl mx-auto px-5 lg:px-8 pt-10 pb-24">
        {/* Back */}
        <Link href={`/${locale}`} className="text-[13px] text-mute hover:text-ink flex items-center gap-1.5 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                s <= step ? "bg-gold" : "bg-line"
              }`}
            />
          ))}
        </div>

        <h1 className="font-serif text-[32px] sm:text-[40px] text-ink mb-2">
          Créer votre événement
        </h1>
        <p className="text-mute text-[14px] mb-10">
          Étape {step} sur 3 — {step === 1 ? "Informations générales" : step === 2 ? "Lieu & dates" : "Tarification & contact"}
        </p>

        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Nom de l&apos;événement</label>
              <input
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="ex: Summit Tech Abidjan 2026"
                className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Type d&apos;événement</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => update({ type: t.value })}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.type === t.value
                        ? "border-gold bg-gold/10"
                        : "border-line bg-cream2 hover:border-gold/30"
                    }`}
                  >
                    <t.icon className="w-6 h-6 mx-auto mb-2 text-gold" />
                    <span className="text-[13px] font-medium text-ink">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Organisateur / Entreprise</label>
              <input
                value={form.organisateur}
                onChange={(e) => update({ organisateur: e.target.value })}
                placeholder="ex: SIREXE Group"
                className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Décrivez votre événement en quelques lignes..."
                rows={4}
                className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px] resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-3 uppercase tracking-wider">Logo de l&apos;événement</label>
              <div className="border-2 border-dashed border-line rounded-2xl p-8 text-center hover:border-gold/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-mute mx-auto mb-3" />
                <p className="text-[13px] text-mute">Glissez votre logo ici ou cliquez pour choisir</p>
                <p className="text-[11px] text-mute/60 mt-1">PNG, JPG — max 2 Mo</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.organisateur}
                className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Date de début</label>
                <input
                  type="date"
                  value={form.dateStart}
                  onChange={(e) => update({ dateStart: e.target.value })}
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Date de fin</label>
                <input
                  type="date"
                  value={form.dateEnd}
                  onChange={(e) => update({ dateEnd: e.target.value })}
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Lieu / Salle</label>
              <input
                value={form.lieu}
                onChange={(e) => update({ lieu: e.target.value })}
                placeholder="ex: Sofitel Hôtel Ivoire"
                className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Ville</label>
              <input
                value={form.ville}
                onChange={(e) => update({ ville: e.target.value })}
                placeholder="ex: Abidjan"
                className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Capacité (nombre de places)</label>
              <input
                type="number"
                value={form.capacite}
                onChange={(e) => update({ capacite: e.target.value })}
                placeholder="ex: 500"
                className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="text-[14px] text-mute hover:text-ink flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.dateStart || !form.lieu || !form.ville}
                className="btn-press inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-ink rounded-full px-8 py-4 text-[15px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            {/* Badge pricing */}
            <div className="bg-cream2 border border-line rounded-2xl p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.badgePayant}
                  onChange={(e) => update({ badgePayant: e.target.checked })}
                  className="accent-gold w-5 h-5 mt-0.5"
                />
                <div>
                  <p className="text-[14px] text-ink font-medium">Badge / accréditation payant</p>
                  <p className="text-[12px] text-mute mt-1">
                    Frais d&apos;identification AÏKO : 10 € par badge délivré
                  </p>
                </div>
              </label>
              {form.badgePayant && (
                <div className="mt-4 ml-8">
                  <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Prix du badge (XOF)</label>
                  <input
                    type="number"
                    value={form.prixBadge}
                    onChange={(e) => update({ prixBadge: e.target.value })}
                    placeholder="ex: 5000"
                    className="w-full bg-white border border-line rounded-xl px-4 py-3.5 text-[15px]"
                  />
                </div>
              )}
            </div>

            {/* Ticket pricing (concerts only) */}
            {isConcert && (
              <div className="bg-cream2 border border-line rounded-2xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.ticketPayant}
                    onChange={(e) => update({ ticketPayant: e.target.checked })}
                    className="accent-gold w-5 h-5 mt-0.5"
                  />
                  <div>
                    <p className="text-[14px] text-ink font-medium">Tickets payants</p>
                    <p className="text-[12px] text-mute mt-1">
                      Commission AÏKO : 10% sur chaque ticket vendu
                    </p>
                  </div>
                </label>
                {form.ticketPayant && (
                  <div className="mt-4 ml-8">
                    <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Prix du ticket (XOF)</label>
                    <input
                      type="number"
                      value={form.prixTicket}
                      onChange={(e) => update({ prixTicket: e.target.value })}
                      placeholder="ex: 15000"
                      className="w-full bg-white border border-line rounded-xl px-4 py-3.5 text-[15px]"
                    />
                  </div>
                )}
              </div>
            )}

            <div style={{ height: 1 }} className="bg-line" />

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Email de contact</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => update({ contactEmail: e.target.value })}
                  placeholder="contact@votre-entreprise.com"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-ink mb-2 uppercase tracking-wider">Téléphone</label>
                <input
                  value={form.contactTel}
                  onChange={(e) => update({ contactTel: e.target.value })}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full bg-cream2 border border-line rounded-xl px-4 py-3.5 text-[15px] mono"
                />
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-ink rounded-2xl p-6 text-cream">
              <p className="text-[12px] uppercase tracking-wider text-cream/40 mb-4">Votre facture</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px]">Création d&apos;événement AÏKO</span>
                <span className="font-serif text-[20px] text-gold">50 €</span>
              </div>
              <p className="text-[11px] text-cream/30">
                {form.badgePayant && "· 10 € / badge payant délivré  "}
                {isConcert && form.ticketPayant && "· 10% / ticket vendu"}
              </p>
            </div>

            <PaymentMethodPicker value={payMethod} onChange={setPayMethod} />

            {payError && (
              <div className="bg-err/10 border border-err/20 text-err rounded-xl px-4 py-3 text-[13px]">
                {payError}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-[14px] text-mute hover:text-ink flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </button>
              <PaymentButton
                amount={32500}
                currency="XOF"
                method={payMethod}
                description={`Création événement AÏKO — ${form.name}`}
                customerName={form.organisateur}
                customerEmail={form.contactEmail}
                customerPhone={form.contactTel}
                eventId={eventId}
                type="event_creation"
                onSuccess={() => setStep(4)}
                onError={setPayError}
                disabled={!form.contactEmail}
                label="Payer 50 € et créer"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
