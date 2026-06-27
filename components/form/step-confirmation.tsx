"use client";

import { CheckCircle2 } from "lucide-react";
import { BookingBadge } from "@/components/badge/booking-badge";
import type { TravelerData } from "./wizard-shell";

interface StepConfirmationProps {
  reference: string;
  traveler: TravelerData;
  typeReservation: "NORMALE" | "INSTITUTIONNELLE";
}

export function StepConfirmation({ reference, traveler, typeReservation }: StepConfirmationProps) {
  const displayRef = reference || "AIKO-26-DEMO";

  return (
    <section className="animate-fade-up">
      <div className="max-w-3xl mx-auto px-5 lg:px-8 pt-10 pb-24">
        <div className="text-center mb-12">
          <CheckCircle2 className="w-16 h-16 text-ok mx-auto mb-5" />
          <h2 className="font-serif text-[36px] sm:text-[44px] text-ink">
            Réservation confirmée
          </h2>
          <p className="text-mute mt-3 text-[16px] max-w-lg mx-auto">
            Merci {traveler.prenom}, votre prise en charge est enregistrée.
            Imprimez votre badge pour un accueil rapide.
          </p>
        </div>

        <BookingBadge
          reference={displayRef}
          prenom={traveler.prenom}
          nom={traveler.nom}
          nationalite={traveler.nationalite}
          dateArrivee={traveler.dateArrivee}
          dateDepart={traveler.dateDepart}
          nombrePersonnes={traveler.nombrePersonnes}
          typeReservation={typeReservation}
        />

        <div className="mt-12 bg-cream2 rounded-2xl p-6 text-center">
          <p className="text-[13px] text-mute">
            Un email de confirmation avec votre badge sera envoyé à{" "}
            <span className="text-ink font-medium">{traveler.email || "votre adresse"}</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
