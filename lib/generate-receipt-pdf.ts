import { jsPDF } from "jspdf";

interface ReceiptData {
  reference: string;
  date: string;
  customerName: string;
  customerEmail: string;
  eventName: string;
  eventDate: string;
  eventLieu: string;
  items: { label: string; amount: number }[];
  total: number;
  currency: string;
  paymentMethod?: string;
}

export function generateReceiptPDF(data: ReceiptData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = 210;
  const margin = 20;
  const cw = w - margin * 2;

  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, w, 50, "F");

  doc.setTextColor(200, 169, 81);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("AIKO", margin, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Board", margin, 32);

  doc.setTextColor(200, 169, 81);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("RECU DE PAIEMENT", w - margin, 25, { align: "right" });

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.text(`N° ${data.reference}`, w - margin, 32, { align: "right" });
  doc.text(data.date, w - margin, 38, { align: "right" });

  let y = 65;

  doc.setTextColor(140, 140, 140);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE A", margin, y);
  doc.text("EVENEMENT", w / 2 + 10, y);

  y += 6;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(data.customerName, margin, y);
  doc.text(data.eventName, w / 2 + 10, y);

  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(data.customerEmail, margin, y);
  doc.text(data.eventDate, w / 2 + 10, y);

  y += 5;
  doc.text(data.eventLieu, w / 2 + 10, y);

  y += 15;

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, cw, 8, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", margin + 4, y + 5.5);
  doc.text("MONTANT", w - margin - 4, y + 5.5, { align: "right" });

  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);

  for (const item of data.items) {
    doc.text(item.label, margin + 4, y);
    doc.text(
      `${new Intl.NumberFormat("fr-FR").format(item.amount)} ${data.currency}`,
      w - margin - 4,
      y,
      { align: "right" }
    );
    y += 7;
  }

  y += 4;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, w - margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 10, 10);
  doc.text("TOTAL", margin + 4, y);
  doc.setTextColor(200, 169, 81);
  doc.text(
    `${new Intl.NumberFormat("fr-FR").format(data.total)} ${data.currency}`,
    w - margin - 4,
    y,
    { align: "right" }
  );

  y += 8;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(140, 140, 140);
  if (data.paymentMethod) {
    doc.text(`Methode de paiement : ${data.paymentMethod}`, margin + 4, y);
  }

  y += 15;

  doc.setFillColor(250, 248, 242);
  doc.roundedRect(margin, y, cw, 20, 3, 3, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.text("Ce recu confirme le paiement recu par AIKO Board.", margin + 6, y + 8);
  doc.text("Pour toute question : contact@aikoboard.com | +225 07 88 00 11 22", margin + 6, y + 14);

  const footerY = 280;
  doc.setDrawColor(200, 169, 81);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, w - margin, footerY);
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(6);
  doc.text("AIKO Board — Abidjan, Cote d'Ivoire", w / 2, footerY + 5, { align: "center" });
  doc.text("aikoboard.com", w / 2, footerY + 9, { align: "center" });

  return doc;
}
