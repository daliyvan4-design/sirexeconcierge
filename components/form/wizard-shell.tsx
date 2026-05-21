"use client";

import { useState, useMemo } from "react";
import { StepIdentity } from "./step-identity";
import { StepServices } from "./step-services";
import { StepRecap } from "./step-recap";

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
  const [cart, setCart] = useState<CartState>(defaultCart);
  const [currency, setCurrency] = useState("XOF");

  const computedNights = useMemo(() => {
    if (traveler.dateArrivee && traveler.dateDepart) {
      const a = new Date(traveler.dateArrivee);
      const d = new Date(traveler.dateDepart);
      const diff = Math.round((d.getTime() - a.getTime()) / 86400000);
      return diff > 0 ? diff : defaultCart.nights;
    }
    return defaultCart.nights;
  }, [traveler.dateArrivee, traveler.dateDepart]);

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
        <StepServices
          cart={cart}
          setCart={setCart}
          pax={traveler.nombrePersonnes}
          nights={computedNights}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepRecap
          cart={cart}
          traveler={traveler}
          currency={currency}
          setCurrency={setCurrency}
          onBack={() => setStep(2)}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
