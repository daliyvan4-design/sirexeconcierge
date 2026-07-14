import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { AnimatedText } from "../components/AnimatedText";

export const CloseSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const logoOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const logoScale = interpolate(frame, [0, 25], [0.85, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [30, 55], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: "center" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 10,
              color: COLORS.cream,
              fontFamily: FONTS.sans,
              fontWeight: 500,
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: -2,
            }}
          >
            aiko board by
          </div>
          <Img
            src={staticFile("logo-sirexe.webp")}
            style={{ height: 90, width: "auto", filter: "brightness(0) invert(1)" }}
          />
        </div>
        <AnimatedText delay={15} style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 6,
              color: COLORS.gold,
              fontWeight: 500,
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Concierge Intelligente
          </div>
        </AnimatedText>

        <div
          style={{
            height: 2,
            width: lineWidth,
            backgroundColor: COLORS.gold,
            borderRadius: 2,
            marginTop: 32,
            marginBottom: 32,
          }}
        />

        <AnimatedText delay={40} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontFamily: FONTS.serif, color: COLORS.cream, lineHeight: 1.5 }}>
            Votre concierge intelligente.
          </div>
        </AnimatedText>

        <AnimatedText delay={60} style={{ textAlign: "center", marginTop: 50 }}>
          <div style={{ fontSize: 16, color: COLORS.mute, lineHeight: 2 }}>
            contact@aikoboard.com
            <br />
            aikoboard.com
          </div>
        </AnimatedText>

        <AnimatedText delay={75} style={{ textAlign: "center", marginTop: 40 }}>
          <div
            style={{
              fontSize: 13,
              color: COLORS.gold,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Merci
          </div>
        </AnimatedText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
