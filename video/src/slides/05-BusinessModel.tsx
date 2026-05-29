import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SlideLayout } from "../components/SlideLayout";
import { AnimatedText } from "../components/AnimatedText";
import { GoldLine } from "../components/GoldLine";
import { COLORS, FONTS } from "../theme";

const REVENUE_STREAMS = [
  { source: "Transport", volume: "Sur chaque trajet réservé" },
  { source: "Hébergement", volume: "Nuitées partenaires" },
  { source: "Restauration", volume: "Réservations restaurant" },
  { source: "Packages VIP", volume: "Services sur-mesure premium" },
];

export const BusinessModelSlide: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SlideLayout>
      <AnimatedText>
        <div style={{ fontSize: 14, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontWeight: 600 }}>
          Business model
        </div>
      </AnimatedText>
      <AnimatedText delay={8}>
        <h2 style={{ fontSize: 48, fontFamily: FONTS.serif, color: COLORS.cream, lineHeight: 1.2, marginTop: 12 }}>
          Commissions + <span style={{ color: COLORS.gold }}>packages premium</span>
        </h2>
      </AnimatedText>
      <GoldLine delay={15} />

      <div style={{ marginTop: 40 }}>
        {/* Table header */}
        <AnimatedText delay={20}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              padding: "14px 28px",
              fontSize: 12,
              letterSpacing: 3,
              color: COLORS.mute,
              textTransform: "uppercase",
              borderBottom: `1px solid ${COLORS.gold}20`,
            }}
          >
            <span>Source</span>
            <span>Détail</span>
          </div>
        </AnimatedText>

        {REVENUE_STREAMS.map((r, i) => (
          <AnimatedText key={i} delay={28 + i * 10}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                padding: "20px 28px",
                borderBottom: `1px solid ${COLORS.ink2}`,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 19, color: COLORS.cream, fontWeight: 500 }}>{r.source}</span>
              <span style={{ fontSize: 15, color: COLORS.mute }}>{r.volume}</span>
            </div>
          </AnimatedText>
        ))}
      </div>

      <div style={{ display: "flex", gap: 32, marginTop: 50 }}>
        <AnimatedText delay={70}>
          <div style={{ backgroundColor: COLORS.ink2, borderRadius: 20, padding: "28px 36px", border: `1px solid ${COLORS.gold}20`, flex: 1 }}>
            <div style={{ fontSize: 14, color: COLORS.mute, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              Objectif an 1
            </div>
            <div style={{ fontSize: 42, color: COLORS.gold, fontFamily: FONTS.serif, fontWeight: 700 }}>€1,5M</div>
            <div style={{ fontSize: 15, color: COLORS.mute, marginTop: 4 }}>de CA sur SIREXE 2026</div>
          </div>
        </AnimatedText>
      </div>
    </SlideLayout>
  );
};
