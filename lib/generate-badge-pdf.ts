import { jsPDF } from "jspdf";

interface BadgeData {
  eventName: string;
  eventDate: string;
  eventLieu: string;
  eventType: string;
  logoDataUrl?: string;
  coverDataUrl?: string;
  participants: {
    name: string;
    organisation?: string;
    email: string;
    reference: string;
    badgeNumber: number;
    qrDataUrl: string;
  }[];
}

const A4_W = 210;
const A4_H = 297;
const BADGE_W = A4_W / 2; // 105mm
const BADGE_H = A4_H / 2; // 148.5mm
const BADGES_PER_PAGE = 4;

const INK = [10, 10, 10] as const;
const GOLD = [200, 169, 81] as const;
const WHITE = [255, 255, 255] as const;

function getBadgePosition(index: number): { x: number; y: number } {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return { x: col * BADGE_W, y: row * BADGE_H };
}

function getMirroredPosition(index: number): { x: number; y: number } {
  const col = index % 2 === 0 ? 1 : 0;
  const row = Math.floor(index / 2);
  return { x: col * BADGE_W, y: row * BADGE_H };
}

function drawBadgeRecto(
  doc: jsPDF,
  pos: { x: number; y: number },
  data: BadgeData,
  participant: BadgeData["participants"][0],
) {
  const { x, y } = pos;
  const pad = 6;

  doc.setFillColor(...INK);
  doc.rect(x, y, BADGE_W, BADGE_H, "F");

  doc.setDrawColor(60, 60, 60);
  doc.rect(x + 0.5, y + 0.5, BADGE_W - 1, BADGE_H - 1);

  // Gold header
  doc.setFillColor(...GOLD);
  doc.rect(x, y, BADGE_W, 14, "F");

  if (data.logoDataUrl) {
    try {
      doc.addImage(data.logoDataUrl, "PNG", x + pad, y + 2, 10, 10);
    } catch {}
  }

  doc.setTextColor(...INK);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("AIKO", x + (data.logoDataUrl ? 18 : pad), y + 9);

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  const typeLabel = data.eventType === "hackathon" ? "HACKATHON" : "BADGE";
  doc.text(typeLabel, x + BADGE_W - pad, y + 9, { align: "right" });

  // Event cover image
  let yContent = y + 18;
  if (data.coverDataUrl) {
    try {
      const imgW = BADGE_W - pad * 2;
      const imgH = 30;
      doc.addImage(data.coverDataUrl, "JPEG", x + pad, yContent, imgW, imgH);
      yContent += imgH + 4;
    } catch {
      yContent += 4;
    }
  } else {
    yContent += 4;
  }

  // Event name
  doc.setTextColor(...GOLD);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const nameLines = doc.splitTextToSize(data.eventName, BADGE_W - pad * 2);
  doc.text(nameLines.slice(0, 2), x + pad, yContent + 4);
  yContent += nameLines.slice(0, 2).length * 5 + 6;

  // Event date & lieu
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(data.eventDate, x + pad, yContent);
  yContent += 4;
  doc.text(data.eventLieu, x + pad, yContent);
  yContent += 8;

  // Separator
  doc.setDrawColor(60, 60, 60);
  doc.line(x + pad, yContent, x + BADGE_W - pad, yContent);
  yContent += 6;

  // Participant name
  doc.setTextColor(...WHITE);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const pNameLines = doc.splitTextToSize(participant.name, BADGE_W - pad * 2);
  doc.text(pNameLines.slice(0, 2), x + pad, yContent + 4);
  yContent += pNameLines.slice(0, 2).length * 6 + 2;

  // Organisation
  if (participant.organisation) {
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(participant.organisation, x + pad, yContent + 3);
    yContent += 8;
  }

  // Badge number (bottom)
  const yBottom = y + BADGE_H - 10;
  doc.setTextColor(...GOLD);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("N°", x + pad, yBottom);
  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  doc.text(String(participant.badgeNumber).padStart(4, "0"), x + pad + 6, yBottom);

  // Type badge bottom right
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text(data.eventType.toUpperCase(), x + BADGE_W - pad, yBottom, { align: "right" });
}

function drawBadgeVerso(
  doc: jsPDF,
  pos: { x: number; y: number },
  data: BadgeData,
  participant: BadgeData["participants"][0],
) {
  const { x, y } = pos;
  const pad = 6;

  doc.setFillColor(...INK);
  doc.rect(x, y, BADGE_W, BADGE_H, "F");

  doc.setDrawColor(60, 60, 60);
  doc.rect(x + 0.5, y + 0.5, BADGE_W - 1, BADGE_H - 1);

  // QR Code centered
  const qrSize = 50;
  const qrX = x + (BADGE_W - qrSize) / 2;
  const qrY = y + 20;
  try {
    doc.addImage(participant.qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  } catch {}

  // Reference
  let yContent = qrY + qrSize + 8;
  doc.setTextColor(...GOLD);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("REFERENCE", x + BADGE_W / 2, yContent, { align: "center" });
  yContent += 6;

  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(participant.reference, x + BADGE_W / 2, yContent, { align: "center" });
  yContent += 10;

  // Participant info
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(participant.name, x + BADGE_W / 2, yContent, { align: "center" });
  yContent += 5;
  doc.text(participant.email, x + BADGE_W / 2, yContent, { align: "center" });
  yContent += 10;

  // Event name
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  const evLines = doc.splitTextToSize(data.eventName, BADGE_W - pad * 4);
  doc.text(evLines.slice(0, 2), x + BADGE_W / 2, yContent, { align: "center" });

  // Scan instruction (bottom)
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("SCANNEZ AVEC AIKO · ACCREDITATION", x + BADGE_W / 2, y + BADGE_H - 8, { align: "center" });

  // Logo bottom if available
  if (data.logoDataUrl) {
    try {
      doc.addImage(data.logoDataUrl, "PNG", x + BADGE_W / 2 - 5, y + BADGE_H - 20, 10, 10);
    } catch {}
  }
}

export function generateBadgePDF(data: BadgeData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const totalParticipants = data.participants.length;

  for (let i = 0; i < totalParticipants; i += BADGES_PER_PAGE) {
    if (i > 0) doc.addPage();

    const batch = data.participants.slice(i, i + BADGES_PER_PAGE);

    // Recto page (fronts)
    batch.forEach((p, idx) => {
      const pos = getBadgePosition(idx);
      drawBadgeRecto(doc, pos, data, p);
    });

    // Verso page (backs - mirrored for double-sided printing)
    doc.addPage();
    batch.forEach((p, idx) => {
      const pos = getMirroredPosition(idx);
      drawBadgeVerso(doc, pos, data, p);
    });
  }

  return doc;
}

export function generateSingleBadgePDF(
  data: Omit<BadgeData, "participants"> & { participant: BadgeData["participants"][0] },
): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [BADGE_W, BADGE_H] });

  drawBadgeRecto(doc, { x: 0, y: 0 }, { ...data, participants: [data.participant] }, data.participant);

  doc.addPage([BADGE_W, BADGE_H]);
  drawBadgeVerso(doc, { x: 0, y: 0 }, { ...data, participants: [data.participant] }, data.participant);

  return doc;
}
