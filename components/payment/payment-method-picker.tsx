"use client";

import { Smartphone, CreditCard, Waves } from "lucide-react";

export type MethodChoice = "wave" | "orange_money" | "mtn_money" | "moov_money" | "card";

const METHODS: { id: MethodChoice; label: string; sub: string; icon: typeof Smartphone }[] = [
  { id: "wave", label: "Wave", sub: "Paiement instantane", icon: Waves },
  { id: "orange_money", label: "Orange Money", sub: "Envoi par USSD / app", icon: Smartphone },
  { id: "mtn_money", label: "MTN Mobile Money", sub: "MoMo", icon: Smartphone },
  { id: "moov_money", label: "Moov Money", sub: "Moov Africa", icon: Smartphone },
  { id: "card", label: "Carte bancaire", sub: "Visa / Mastercard", icon: CreditCard },
];

interface Props {
  value: MethodChoice | null;
  onChange: (m: MethodChoice) => void;
}

export function PaymentMethodPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-medium text-ink uppercase tracking-wider mb-3">
        Mode de paiement
      </p>
      {METHODS.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
            value === m.id
              ? "border-gold bg-gold/5"
              : "border-line bg-cream2 hover:border-gold/30"
          }`}
        >
          <m.icon
            className={`w-5 h-5 ${value === m.id ? "text-gold" : "text-mute"}`}
          />
          <div className="flex-1">
            <p className="text-[14px] font-medium text-ink">{m.label}</p>
            <p className="text-[11px] text-mute">{m.sub}</p>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              value === m.id ? "border-gold" : "border-line"
            }`}
          >
            {value === m.id && (
              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
