import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AÏKO — Event & Tech · Créez, participez, badgez",
  description:
    "AÏKO Event & Tech — Plateforme de création et gestion d'événements. Badges, tickets et accréditations avec QR code. www.aïkoevent.com",
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
