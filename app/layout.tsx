import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIREXE Concierge — Votre séjour, orchestré avec soin",
  description:
    "Conciergerie officielle du salon SIREXE 2026 à Abidjan. Transport, hébergement, repas et services exclusifs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
