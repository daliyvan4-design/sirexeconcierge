import React from "react";
import { SlideLayout } from "../components/SlideLayout";
import { AnimatedText } from "../components/AnimatedText";
import { GoldLine } from "../components/GoldLine";
import { COLORS, FONTS } from "../theme";

const SERVICES = [
  { icon: "🚘", title: "Transport", desc: "Chauffeurs vérifiés, trajets préprogrammés" },
  { icon: "🏨", title: "Hébergement", desc: "Hôtels partenaires audités et garantis" },
  { icon: "🍽️", title: "Restauration", desc: "Tables réservées, régimes respectés" },
  { icon: "✨", title: "Services VIP", desc: "Sur-mesure : guides, excursions, achats" },
];

export const SolutionSlide: React.FC = () => {
  return (
    <SlideLayout>
      <AnimatedText>
        <div style={{ fontSize: 14, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontWeight: 600 }}>
          La solution
        </div>
      </AnimatedText>
      <AnimatedText delay={8}>
        <h2 style={{ fontSize: 48, fontFamily: FONTS.serif, color: COLORS.cream, lineHeight: 1.2, marginTop: 12 }}>
          <span style={{ color: COLORS.gold }}>AIKO Board</span> — Concierge Intelligente
        </h2>
      </AnimatedText>
      <GoldLine delay={15} />
      <AnimatedText delay={20}>
        <p style={{ fontSize: 20, color: COLORS.mute, maxWidth: 700, lineHeight: 1.6 }}>
          Une concierge intelligente qui orchestre le séjour des visiteurs
          et les oriente vers le bon prestataire — hôtels, appart-hôtels, meublés, transport.
        </p>
      </AnimatedText>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 50 }}>
        {SERVICES.map((s, i) => (
          <AnimatedText key={i} delay={30 + i * 10}>
            <div
              style={{
                backgroundColor: COLORS.ink2,
                borderRadius: 20,
                padding: "28px 32px",
                border: `1px solid ${COLORS.gold}15`,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 22, color: COLORS.cream, fontWeight: 600, fontFamily: FONTS.serif }}>{s.title}</div>
              <div style={{ fontSize: 16, color: COLORS.mute, marginTop: 6 }}>{s.desc}</div>
            </div>
          </AnimatedText>
        ))}
      </div>
    </SlideLayout>
  );
};
