"use client";

import { QRCodeSVG } from "qrcode.react";

export default function PreviewBadge() {
  return (
    <div className="min-h-screen bg-cream2 flex items-center justify-center gap-10 p-10 flex-wrap">
      <div>
        <p className="text-[12px] uppercase tracking-wider text-mute mb-4 text-center">Badge Conference</p>
        <div className="w-[380px] bg-ink rounded-2xl overflow-hidden shadow-float">
          <div className="bg-gold px-6 py-4 flex items-center justify-between">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>AIKO</span>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#0A0A0A", fontWeight: 600 }}>Badge</span>
          </div>
          <div className="px-6 pt-5 pb-3">
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", lineHeight: 1.2 }}>Amadou Diallo</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>AIKO Group</p>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />
          <div className="px-6 py-4">
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Evenement</p>
            <p style={{ fontSize: 15, color: "#C8A951", fontWeight: 600, marginTop: 4 }}>Salon Tech Abidjan 2026</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>11 — 17 mars 2026</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Sofitel Hotel Ivoire · Abidjan</p>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Reference</p>
              <p style={{ fontSize: 14, color: "#C8A951", fontWeight: 600, marginTop: 2, fontFamily: "monospace" }}>AIKO-X7K2M9</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>N°</p>
              <p style={{ fontSize: 14, color: "#fff", fontWeight: 500, marginTop: 2 }}>0042</p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
            <QRCodeSVG value={JSON.stringify({ ref: "AIKO-X7K2M9", event: "Salon Tech Abidjan 2026", name: "Amadou Diallo", type: "badge", ticket: 42 })} size={150} bgColor="transparent" fgColor="#C8A951" level="M" />
          </div>
          <div className="px-6 pb-4 text-center">
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>Scannez avec AIKO · Accreditation</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[12px] uppercase tracking-wider text-mute mb-4 text-center">Ticket Concert</p>
        <div className="w-[380px] bg-ink rounded-2xl overflow-hidden shadow-float">
          <div className="bg-gold px-6 py-4 flex items-center justify-between">
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>AIKO</span>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#0A0A0A", fontWeight: 600 }}>Ticket</span>
          </div>
          <div className="px-6 pt-5 pb-3">
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", lineHeight: 1.2 }}>Marie Kouassi</p>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />
          <div className="px-6 py-4">
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Evenement</p>
            <p style={{ fontSize: 15, color: "#C8A951", fontWeight: 600, marginTop: 4 }}>Afro Music Festival</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>22 — 24 avril 2026</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Palais de la Culture · Abidjan</p>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Reference</p>
              <p style={{ fontSize: 14, color: "#C8A951", fontWeight: 600, marginTop: 2, fontFamily: "monospace" }}>AIKO-R3P8W1</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Ticket N°</p>
              <p style={{ fontSize: 18, color: "#fff", fontWeight: 700, marginTop: 2, fontFamily: "monospace" }}>0187</p>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 24px" }} />
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Montant</p>
              <p style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>15 000 XOF</p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
            <QRCodeSVG value={JSON.stringify({ ref: "AIKO-R3P8W1", event: "Afro Music Festival", name: "Marie Kouassi", type: "ticket", ticket: 187 })} size={150} bgColor="transparent" fgColor="#C8A951" level="M" />
          </div>
          <div className="px-6 pb-4 text-center">
            <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>Scannez avec AIKO · Ticket numerique</p>
          </div>
        </div>
      </div>
    </div>
  );
}
