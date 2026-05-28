import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A2E",
        ink2: "#252540",
        ink3: "#2D2D2D",
        gold: "#C9A84C",
        gold2: "#B89537",
        cream: "#F8F7F4",
        cream2: "#EFEDE5",
        line: "#E5E2D8",
        mute: "#6B6B72",
        ok: "#2E7D52",
        err: "#C0392B",
        mining: "#E87722",
        oil: "#0F0F1C",
        energy: "#2E7D52",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "none",
        float: "0 12px 36px -22px rgba(26,26,46,.22)",
        inner1: "inset 0 0 0 1px rgba(26,26,46,.06)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "none" },
        },
        draw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fadeUp .35s ease both",
        draw: "draw 700ms .25s ease forwards",
        "draw-circle": "draw 900ms ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
