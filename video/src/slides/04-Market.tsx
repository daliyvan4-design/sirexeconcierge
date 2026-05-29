import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SlideLayout } from "../components/SlideLayout";
import { AnimatedText } from "../components/AnimatedText";
import { GoldLine } from "../components/GoldLine";
import { COLORS, FONTS } from "../theme";

const METRICS = [
  { value: "50 000+", label: "Visiteurs attendus", sub: "SIREXE 2026 · Abidjan" },
  { value: "35%", label: "Internationaux", sub: "Cible premium directe" },
  { value: "5 jours", label: "Durée du salon", sub: "Séjour moyen : 7 jours" },
  { value: "€595", label: "Panier moyen estimé", sub: "Par visiteur international" },
];

export const MarketSlide: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SlideLayout>
      <AnimatedText>
        <div style={{ fontSize: 14, letterSpacing: 4, color: COLORS.gold, textTransform: "uppercase", fontWeight: 600 }}>
          Le marché
        </div>
      </AnimatedText>
      <AnimatedText delay={8}>
        <h2 style={{ fontSize: 48, fontFamily: FONTS.serif, color: COLORS.cream, lineHeight: 1.2, marginTop: 12 }}>
          Un marché captif de
          <span style={{ color: COLORS.gold }}> 17 500 clients</span> potentiels
        </h2>
      </AnimatedText>
      <GoldLine delay={15} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 50 }}>
        {METRICS.map((m, i) => {
          const delay = 25 + i * 12;
          const scale = interpolate(frame, [delay, delay + 15], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `scale(${scale})`,
                backgroundColor: COLORS.ink2,
                borderRadius: 20,
                padding: "36px 32px",
                border: `1px solid ${COLORS.gold}20`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: COLORS.gold,
                  fontFamily: FONTS.serif,
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: 18, color: COLORS.cream, fontWeight: 600, marginTop: 12 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 14, color: COLORS.mute, marginTop: 6 }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      <AnimatedText delay={75} style={{ marginTop: 40, textAlign: "center" }}>
        <div style={{ fontSize: 18, color: COLORS.mute, fontStyle: "italic", fontFamily: FONTS.serif }}>
          TAM estimé : <span style={{ color: COLORS.gold, fontWeight: 600 }}>€10,4M</span> sur le premier événement
        </div>
      </AnimatedText>
    </SlideLayout>
  );
};
