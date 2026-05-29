import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AÏKO — Accueil Intelligent · Knowledge · Orientation",
  description:
    "AÏKO — Votre concierge intelligente pour le salon SIREXE 2026 à Abidjan. Transport, hébergement, restauration et services premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-cream text-ink3 font-sans antialiased">{children}</body>
    </html>
  );
}
