import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createPayment,
  isGeniusPayConfigured,
  type CreatePaymentInput,
} from "@/lib/geniuspay";

function genPayRef() {
  return `PAY-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

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
      event_slug?: string;
      participant_ref?: string;
      type?: string;
    };

    if (!body.amount || body.amount < 200) {
      return NextResponse.json(
        { error: "Montant minimum : 200 XOF" },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") ?? "";
    const payRef = genPayRef();

    const successParams = new URLSearchParams({ ref: payRef });
    if (body.participant_ref) successParams.set("p", body.participant_ref);
    if (body.event_slug) successParams.set("event", body.event_slug);
    if (body.type) successParams.set("type", body.type);

    let eventId: string | undefined;
    if (body.event_slug) {
      const event = await prisma.event.findUnique({
        where: { slug: body.event_slug },
        select: { id: true },
      });
      if (event) eventId = event.id;
    }

    await prisma.payment.create({
      data: {
        reference: payRef,
        type: body.type ?? "other",
        montant: body.amount,
        devise: body.currency ?? "XOF",
        statut: "pending",
        methode: body.payment_method,
        customerName: body.customer_name,
        customerEmail: body.customer_email,
        eventId,
        metadata: JSON.stringify({
          participant_ref: body.participant_ref,
          event_slug: body.event_slug,
          type: body.type,
        }),
      },
    });

    const input: CreatePaymentInput = {
      amount: body.amount,
      currency: (body.currency as "XOF" | "EUR" | "USD") ?? "XOF",
      payment_method: body.payment_method as CreatePaymentInput["payment_method"],
      description: body.description ?? "Paiement AIKO Event & Tech",
      customer: {
        name: body.customer_name,
        email: body.customer_email,
        phone: body.customer_phone,
        country: "CI",
      },
      success_url: `${origin}/fr/paiement/succes?${successParams.toString()}`,
      error_url: `${origin}/fr/paiement/echec?ref=${payRef}`,
      metadata: {
        pay_ref: payRef,
        ...(body.participant_ref && { participant_ref: body.participant_ref }),
        ...(body.event_slug && { event_slug: body.event_slug }),
        ...(body.type && { type: body.type }),
        platform: "aiko-event",
      },
    };

    const payment = await createPayment(input);

    await prisma.payment.update({
      where: { reference: payRef },
      data: { geniusRef: payment.reference },
    });

    return NextResponse.json({
      success: true,
      reference: payRef,
      genius_reference: payment.reference,
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
