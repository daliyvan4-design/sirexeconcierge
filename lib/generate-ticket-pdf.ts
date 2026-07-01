import { jsPDF } from "jspdf";

interface TicketData {
  eventName: string;
  eventDate: string;
  eventLieu: string;
  participantName: string;
  email: string;
  reference: string;
  ticketNumber: number;
  price: number;
  qrDataUrl: string;
}

export function generateTicketPDF(data: TicketData): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 200] });
  const w = 100;

  // Background
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, w, 200, "F");

  // Gold header bar
  doc.setFillColor(200, 169, 81);
  doc.rect(0, 0, w, 18, "F");

  doc.setTextColor(10, 10, 10);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AIKO", 8, 12);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("TICKET", w - 8, 12, { align: "right" });

  // Event name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const nameLines = doc.splitTextToSize(data.eventName, w - 16);
  doc.text(nameLines, 8, 30);

  // Event info
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(data.eventDate, 8, 30 + nameLines.length * 6 + 4);
  doc.text(data.eventLieu, 8, 30 + nameLines.length * 6 + 10);

  const yAfterInfo = 30 + nameLines.length * 6 + 18;

  // Separator
  doc.setDrawColor(60, 60, 60);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(8, yAfterInfo, w - 8, yAfterInfo);

  // Participant
  doc.setTextColor(200, 169, 81);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("PARTICIPANT", 8, yAfterInfo + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.participantName, 8, yAfterInfo + 14);

  doc.setTextColor(140, 140, 140);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(data.email, 8, yAfterInfo + 20);

  // Ticket number & reference
  const yTicket = yAfterInfo + 30;

  doc.setDrawColor(60, 60, 60);
  doc.line(8, yTicket - 4, w - 8, yTicket - 4);

  doc.setTextColor(200, 169, 81);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("TICKET N°", 8, yTicket + 2);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(String(data.ticketNumber).padStart(4, "0"), 8, yTicket + 12);

  doc.setTextColor(200, 169, 81);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("REFERENCE", w - 8, yTicket + 2, { align: "right" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(data.reference, w - 8, yTicket + 8, { align: "right" });

  // Price
  if (data.price > 0) {
    doc.setTextColor(200, 169, 81);
    doc.setFontSize(6);
    doc.text("MONTANT", w - 8, yTicket + 16, { align: "right" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${new Intl.NumberFormat("fr-FR").format(data.price)} XOF`, w - 8, yTicket + 22, { align: "right" });
  }

  // QR Code
  const yQr = yTicket + 30;
  doc.setDrawColor(60, 60, 60);
  doc.line(8, yQr - 4, w - 8, yQr - 4);

  const qrSize = 40;
  const qrX = (w - qrSize) / 2;
  doc.addImage(data.qrDataUrl, "PNG", qrX, yQr, qrSize, qrSize);

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(5);
  doc.setFont("helvetica", "normal");
  doc.text("Scannez avec AIKO · Ticket numerique", w / 2, yQr + qrSize + 6, { align: "center" });

  return doc;
}
