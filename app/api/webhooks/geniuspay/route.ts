import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, type WebhookPayload } from "@/lib/geniuspay";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-webhook-signature") ?? "";
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";
  const event = req.headers.get("x-webhook-event") ?? "";

  const rawBody = await req.text();

  if (!verifyWebhookSignature(timestamp, rawBody, signature)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 },
    );
  }

  const payload = JSON.parse(rawBody) as WebhookPayload;

  switch (event) {
    case "payment.success": {
      const { metadata } = payload.data;
      const payRef = metadata?.pay_ref;

      if (payRef) {
        await prisma.payment.updateMany({
          where: { reference: payRef },
          data: {
            statut: "completed",
            geniusRef: payload.data.reference?.toString(),
            methode: payload.data.payment_method,
          },
        });
      }

      const participantRef = metadata?.participant_ref;
      if (participantRef) {
        await prisma.participant.updateMany({
          where: { reference: participantRef },
          data: {
            statut: "confirme",
            paymentRef: payRef,
          },
        });
      }

      const eventSlug = metadata?.event_slug;
      const type = metadata?.type;
      if (eventSlug && type === "event_creation") {
        await prisma.event.updateMany({
          where: { slug: eventSlug },
          data: {
            statut: "actif",
            paymentRef: payRef,
          },
        });
      }

      console.log(
        `[GeniusPay] Payment completed: ${payRef} — participant: ${participantRef ?? "n/a"} — event: ${eventSlug ?? "n/a"}`,
      );
      break;
    }

    case "payment.failed":
    case "payment.cancelled":
    case "payment.expired": {
      const { metadata, status } = payload.data;
      const payRef = metadata?.pay_ref;
      const dbStatus = status === "failed" ? "echoue" : status === "cancelled" ? "annule" : "expire";

      if (payRef) {
        await prisma.payment.updateMany({
          where: { reference: payRef },
          data: { statut: dbStatus },
        });
      }

      const participantRef = metadata?.participant_ref;
      if (participantRef) {
        await prisma.participant.updateMany({
          where: { reference: participantRef },
          data: { statut: "echoue" },
        });
      }

      console.log(`[GeniusPay] Payment ${status}: ${payRef}`);
      break;
    }

    case "payment.refunded": {
      const { metadata, amount } = payload.data;
      const payRef = metadata?.pay_ref;

      if (payRef) {
        await prisma.payment.updateMany({
          where: { reference: payRef },
          data: { statut: "rembourse" },
        });
      }

      console.log(`[GeniusPay] Payment refunded: ${payRef} — ${amount} XOF`);
      break;
    }

    default:
      console.log(`[GeniusPay] Unhandled event: ${event}`);
  }

  return NextResponse.json({ received: true });
}
