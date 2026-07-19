"use client";

import { QRCodeSVG } from "qrcode.react";

function BadgeRecto({ eventLogo, eventCover }: { eventLogo?: string; eventCover?: string }) {
  return (
    <div className="w-[280px] h-[396px] bg-ink rounded-lg overflow-hidden shadow-float flex flex-col relative">
      {/* Gold header */}
      <div className="bg-gold px-4 py-2.5 flex items-center justify-between shrink-0">
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>AIKO</span>
        <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.2em", color: "#0A0A0A", fontWeight: 600 }}>Badge</span>
      </div>

      {/* Cover image */}
      {eventCover && (
        <div className="mx-4 mt-3 rounded overflow-hidden shrink-0">
          <div className="w-full h-[70px] bg-ink2 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>EVENT COVER</span>
          </div>
        </div>
      )}

      {/* Event info */}
      <div className="px-4 pt-3 pb-2">
        <p style={{ fontSize: 12, color: "#C8A951", fontWeight: 600 }}>Salon Tech Abidjan 2026</p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>11 — 17 mars 2026</p>
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Sofitel Hotel Ivoire · Abidjan</p>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />

      {/* Participant */}
      <div className="px-4 pt-3 pb-2 flex-1">
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", lineHeight: 1.2 }}>Amadou Diallo</p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>AIKO Group</p>
      </div>

      {/* Badge number bottom */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 7, color: "#C8A951", fontWeight: 600 }}>N°</span>
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>0042</span>
        </div>
        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em" }}>CONFERENCE</span>
      </div>
    </div>
  );
}

function BadgeVerso() {
  return (
    <div className="w-[280px] h-[396px] bg-ink rounded-lg overflow-hidden shadow-float flex flex-col items-center justify-center relative">
      {/* QR Code */}
      <div className="flex-1 flex items-center justify-center pt-6">
        <QRCodeSVG
          value={JSON.stringify({ ref: "AIKO-X7K2M9", event: "Salon Tech Abidjan 2026", name: "Amadou Diallo", type: "badge", ticket: 42 })}
          size={130}
          bgColor="transparent"
          fgColor="#C8A951"
          level="M"
        />
      </div>

      {/* Reference */}
      <div className="text-center pb-2">
        <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Reference</p>
        <p style={{ fontSize: 12, color: "#C8A951", fontWeight: 600, marginTop: 3, fontFamily: "monospace" }}>AIKO-X7K2M9</p>
      </div>

      {/* Participant */}
      <div className="text-center py-3">
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Amadou Diallo</p>
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>amadou@aikogroup.com</p>
      </div>

      {/* Event */}
      <div className="text-center pb-3">
        <p style={{ fontSize: 8, color: "#C8A951", fontWeight: 600 }}>Salon Tech Abidjan 2026</p>
      </div>

      {/* Footer */}
      <div className="pb-3">
        <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)" }}>Scannez avec AIKO · Accreditation</p>
      </div>
    </div>
  );
}

function TicketConcert() {
  return (
    <div className="w-[280px] bg-ink rounded-lg overflow-hidden shadow-float">
      <div className="bg-gold px-4 py-2.5 flex items-center justify-between">
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#0A0A0A", letterSpacing: "0.04em" }}>AIKO</span>
        <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.2em", color: "#0A0A0A", fontWeight: 600 }}>Ticket</span>
      </div>
      <div className="px-4 pt-4 pb-2">
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", lineHeight: 1.2 }}>Marie Kouassi</p>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
      <div className="px-4 py-3">
        <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Evenement</p>
        <p style={{ fontSize: 12, color: "#C8A951", fontWeight: 600, marginTop: 3 }}>Afro Music Festival</p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>22 — 24 avril 2026</p>
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Palais de la Culture · Abidjan</p>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div>
          <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Reference</p>
          <p style={{ fontSize: 11, color: "#C8A951", fontWeight: 600, marginTop: 2, fontFamily: "monospace" }}>AIKO-R3P8W1</p>
        </div>
        <div className="text-right">
          <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)" }}>Ticket N°</p>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 700, marginTop: 2, fontFamily: "monospace" }}>0187</p>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
      <div className="px-4 py-2 flex items-center justify-between">
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Montant</p>
        <p style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>15 000 XOF</p>
      </div>
      {/* Places */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ background: "rgba(200,169,81,0.06)" }}>
        <p style={{ fontSize: 9, color: "#C8A951", fontWeight: 600 }}>Places</p>
        <p style={{ fontSize: 12, color: "#C8A951", fontWeight: 700 }}>187 / 2000</p>
      </div>
      <div className="px-4 py-4 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
        <QRCodeSVG value={JSON.stringify({ ref: "AIKO-R3P8W1", event: "Afro Music Festival", name: "Marie Kouassi", type: "ticket", ticket: 187 })} size={120} bgColor="transparent" fgColor="#C8A951" level="M" />
      </div>
      <div className="px-4 pb-3 text-center">
        <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)" }}>Scannez avec AIKO · Ticket numerique</p>
      </div>
    </div>
  );
}

function A4Sheet() {
  return (
    <div className="border border-dashed border-gray-300 rounded" style={{ width: 595, height: 842, position: "relative", background: "#fff", padding: 0 }}>
      <p className="absolute -top-6 left-0 text-[10px] uppercase tracking-wider text-mute">Format A4 — 4 badges (recto)</p>
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="border border-gray-200 flex items-center justify-center overflow-hidden" style={{ background: "#0A0A0A" }}>
            <div className="scale-[0.65] origin-center">
              <BadgeRecto eventCover="yes" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PreviewBadge() {
  return (
    <div className="min-h-screen bg-cream2 p-10">
      <h1 className="text-2xl font-bold text-ink mb-2">Badge & Ticket Preview</h1>
      <p className="text-sm text-mute mb-8">Recto/verso pour conferences & hackathons · Ticket concert avec places</p>

      {/* Recto / Verso side by side */}
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-wider text-mute mb-4">Badge Conference — Recto / Verso</p>
        <div className="flex items-start gap-6 flex-wrap">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-center text-mute mb-2">Recto (face)</p>
            <BadgeRecto eventCover="yes" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-center text-mute mb-2">Verso (dos)</p>
            <BadgeVerso />
          </div>
        </div>
      </div>

      {/* Concert ticket */}
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-wider text-mute mb-4">Ticket Concert — avec nombre de places</p>
        <TicketConcert />
      </div>

      {/* A4 sheet preview */}
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-wider text-mute mb-6">Impression A4 — 4 badges par page</p>
        <A4Sheet />
      </div>
    </div>
  );
}
