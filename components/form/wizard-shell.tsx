"use client";

import { useState } from "react";
import { StepIdentity } from "./step-identity";

export interface TravelerData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  indicatif: string;
  nationalite: string;
  nombrePersonnes: number;
  dateArrivee: string;
  dateDepart: string;
  compagnie: string;
  numeroVol: string;
  flightDate: string;
  flightTime: string;
  aeroport: string;
  passeport: string;
  typeVisa: string;
  statutVisa: string;
  notes: string;
}

export interface CartState {
  transport: Record<string, number>;
  hotel: { id: string; nights: number } | null;
  meals: Record<string, boolean>;
  extras: Set<string>;
  pax: number;
  nights: number;
}

const defaultTraveler: TravelerData = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  indicatif: "+225",
  nationalite: "\u{1F1E8}\u{1F1EE} Ivoirienne",
  nombrePersonnes: 2,
  dateArrivee: "2026-03-12",
  dateDepart: "2026-03-16",
  compagnie: "",
  numeroVol: "",
  flightDate: "2026-03-12",
  flightTime: "23:40",
  aeroport: "FHB",
  passeport: "",
  typeVisa: "Affaires — court séjour",
  statutVisa: "ok",
  notes: "",
};

const defaultCart: CartState = {
  transport: {},
  hotel: null,
  meals: {},
  extras: new Set(),
  pax: 2,
  nights: 4,
};

export function WizardShell() {
  const [step, setStep] = useState(1);
  const [traveler, setTraveler] = useState<TravelerData>(defaultTraveler);
  const [_cart, _setCart] = useState<CartState>(defaultCart);

  return (
    <div className="animate-fade-up">
      {step === 1 && (
        <StepIdentity
          data={traveler}
          onChange={setTraveler}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <div className="max-w-5xl mx-auto px-5 py-10 text-center text-mute">
          Step 2 — Services (coming next)
        </div>
      )}
      {step === 3 && (
        <div className="max-w-5xl mx-auto px-5 py-10 text-center text-mute">
          Step 3 — Recap (coming next)
        </div>
      )}
    </div>
  );
}
