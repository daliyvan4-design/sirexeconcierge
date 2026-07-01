import { NextRequest, NextResponse } from "next/server";
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
      const { reference, amount, metadata } = payload.data;
      console.log(
        `[GeniusPay] Payment completed: ${reference} — ${amount} XOF — event: ${metadata?.event_id ?? "n/a"}`,
      );
      break;
    }

    case "payment.failed":
    case "payment.cancelled":
    case "payment.expired": {
      const { reference, status } = payload.data;
      console.log(
        `[GeniusPay] Payment ${status}: ${reference}`,
      );
      break;
    }

    case "payment.refunded": {
      const { reference, amount } = payload.data;
      console.log(
        `[GeniusPay] Payment refunded: ${reference} — ${amount} XOF`,
      );
      break;
    }

    default:
      console.log(`[GeniusPay] Unhandled event: ${event}`);
  }

  return NextResponse.json({ received: true });
}
