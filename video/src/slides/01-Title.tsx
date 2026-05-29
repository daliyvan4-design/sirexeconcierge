import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { AnimatedText } from "../components/AnimatedText";
import { GoldLine } from "../components/GoldLine";

export const TitleSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const bgOpacity = interpolate(frame, [0, 40], [0, 0.15], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <Img
        src={staticFile("sirexe-event.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgOpacity,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.ink} 40%, transparent 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, marginBottom: 10, textAlign: "center" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 8,
              color: COLORS.cream,
              fontFamily: FONTS.sans,
              fontWeight: 500,
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: -4,
            }}
          >
            aïko by
          </div>
          <Img
            src={staticFile("logo-sirexe.webp")}
            style={{ height: 80, width: "auto", filter: "brightness(0) invert(1)" }}
          />
        </div>
        <AnimatedText delay={15} style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 6,
              color: COLORS.gold,
              fontFamily: FONTS.sans,
              fontWeight: 500,
              textTransform: "uppercase",
            }}
          >
            Concierge Intelligente
          </div>
        </AnimatedText>
        <GoldLine delay={25} width={200} />
        <AnimatedText delay={30} style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 32,
              color: COLORS.cream,
              fontFamily: FONTS.serif,
              lineHeight: 1.4,
              maxWidth: 800,
            }}
          >
            La concierge intelligente
            <br />
            du Salon SIREXE 2026
          </div>
        </AnimatedText>
        <AnimatedText delay={50} style={{ textAlign: "center", marginTop: 30 }}>
          <div
            style={{
              fontSize: 16,
              color: COLORS.mute,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Présentation Investisseurs · Mai 2026
          </div>
        </AnimatedText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
