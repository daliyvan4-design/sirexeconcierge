import { NextRequest, NextResponse } from "next/server";
import {
  createPayment,
  isGeniusPayConfigured,
  type CreatePaymentInput,
} from "@/lib/geniuspay";

export async function POST(req: NextRequest) {
  if (!isGeniusPayConfigured()) {
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as {
      amount: number;
      currency?: string;
      payment_method?: string;
      description?: string;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      success_url?: string;
      error_url?: string;
      event_id?: string;
      type?: string;
    };

    if (!body.amount || body.amount < 200) {
      return NextResponse.json(
        { error: "Montant minimum : 200 XOF" },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") ?? "";

    const input: CreatePaymentInput = {
      amount: body.amount,
      currency: (body.currency as "XOF" | "EUR" | "USD") ?? "XOF",
      payment_method: body.payment_method as CreatePaymentInput["payment_method"],
      description: body.description ?? "Paiement AÏKO Event & Tech",
      customer: {
        name: body.customer_name,
        email: body.customer_email,
        phone: body.customer_phone,
        country: "CI",
      },
      success_url: body.success_url ?? `${origin}/fr/paiement/succes`,
      error_url: body.error_url ?? `${origin}/fr/paiement/echec`,
      metadata: {
        ...(body.event_id && { event_id: body.event_id }),
        ...(body.type && { type: body.type }),
        platform: "aiko-event",
      },
    };

    const payment = await createPayment(input);

    return NextResponse.json({
      success: true,
      reference: payment.reference,
      checkout_url: payment.checkout_url,
      payment_url: payment.payment_url,
      status: payment.status,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur de paiement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
