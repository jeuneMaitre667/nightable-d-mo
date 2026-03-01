import Stripe from "stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { sendReservationConfirmation } from "@/lib/resend";
import { getStripe } from "@/lib/stripe";
import { sendSMS } from "@/lib/twilio";

type SubscriptionTier = "starter" | "pro" | "premium";

function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Configuration Supabase admin manquante");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function formatEventDate(dateValue: string, startTime: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(`${dateValue}T${startTime}`));
}

function parseSubscriptionTier(subscription: Stripe.Subscription): SubscriptionTier {
  const metadataTier = subscription.metadata?.tier;
  if (metadataTier === "pro" || metadataTier === "premium" || metadataTier === "starter") {
    return metadataTier;
  }

  const priceId = subscription.items.data[0]?.price.id;

  if (priceId && process.env.STRIPE_PRICE_PREMIUM_ID && priceId === process.env.STRIPE_PRICE_PREMIUM_ID) {
    return "premium";
  }

  if (priceId && process.env.STRIPE_PRICE_PRO_ID && priceId === process.env.STRIPE_PRICE_PRO_ID) {
    return "pro";
  }

  return "starter";
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const supabase = getAdminSupabaseClient();
  const reservationIdFromMetadata = paymentIntent.metadata?.reservation_id;

  let { data: reservation } = await supabase
    .from("reservations")
    .select("id, event_id, event_table_id, client_id, promoter_id, prepayment_amount, promo_code_used, qr_code")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .maybeSingle();

  if (!reservation && reservationIdFromMetadata) {
    const metadataLookup = await supabase
      .from("reservations")
      .select("id, event_id, event_table_id, client_id, promoter_id, prepayment_amount, promo_code_used, qr_code")
      .eq("id", reservationIdFromMetadata)
      .maybeSingle();

    reservation = metadataLookup.data ?? null;
  }

  if (!reservation) {
    return;
  }

  await supabase
    .from("reservations")
    .update({
      status: "confirmed",
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq("id", reservation.id);

  await supabase
    .from("event_tables")
    .update({
      status: "reserved",
    })
    .eq("id", reservation.event_table_id);

  const [{ data: event }, { data: eventTable }, { data: clientProfile }, { data: profile }] = await Promise.all([
    supabase
      .from("events")
      .select("id, club_id, title, date, start_time")
      .eq("id", reservation.event_id)
      .maybeSingle(),
    supabase
      .from("event_tables")
      .select("table:tables(name)")
      .eq("id", reservation.event_table_id)
      .maybeSingle(),
    supabase
      .from("client_profiles")
      .select("first_name, last_name, phone")
      .eq("id", reservation.client_id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("email")
      .eq("id", reservation.client_id)
      .maybeSingle(),
  ]);

  const tableRelation = eventTable?.table as unknown;
  const tableName = Array.isArray(tableRelation)
    ? (tableRelation[0] as { name?: string } | undefined)?.name
    : (tableRelation as { name?: string } | null | undefined)?.name;

  if (reservation.promoter_id && event?.club_id) {
    try {
      const { data: promoter } = await supabase
        .from("promoter_profiles")
        .select("id, commission_rate")
        .eq("id", reservation.promoter_id)
        .maybeSingle();

      if (promoter) {
        const baseAmount = Number(reservation.prepayment_amount ?? 0);
        const commissionRate = Number(promoter.commission_rate ?? 8);
        const commissionAmount = Number(((baseAmount * commissionRate) / 100).toFixed(2));

        await supabase.from("commissions").upsert(
          {
            promoter_id: promoter.id,
            reservation_id: reservation.id,
            club_id: event.club_id,
            commission_rate: commissionRate,
            nighttable_micro_rate: 0,
            base_amount: baseAmount,
            club_commission_amount: commissionAmount,
            nighttable_commission_amount: 0,
            total_commission_amount: commissionAmount,
            amount: commissionAmount,
            rate: commissionRate,
            status: "pending",
          },
          { onConflict: "reservation_id" }
        );

        const { data: currentPromoter } = await supabase
          .from("promoter_profiles")
          .select("total_earned")
          .eq("id", promoter.id)
          .maybeSingle();

        const nextTotalEarned = Number(currentPromoter?.total_earned ?? 0) + commissionAmount;

        await supabase
          .from("promoter_profiles")
          .update({ total_earned: Number(nextTotalEarned.toFixed(2)) })
          .eq("id", promoter.id);
      }
    } catch (error) {
      console.error("[stripe-webhook] commission creation failed", error);
    }
  }

  if (reservation.promo_code_used) {
    await supabase
      .from("promoter_clicks")
      .update({ converted: true, reservation_id: reservation.id })
      .eq("promo_code", reservation.promo_code_used)
      .eq("converted", false)
      .is("reservation_id", null);
  }

  if (clientProfile?.phone && event?.title && event?.date && event?.start_time && tableName) {
    await sendSMS({
      to: clientProfile.phone,
      body: `NightTable: réservation confirmée pour ${event.title}, table ${tableName}. Code: ${reservation.qr_code ?? reservation.id}.`,
    });
  }

  if (profile?.email && event?.title && event?.date && event?.start_time && tableName) {
    await sendReservationConfirmation({
      to: profile.email,
      reservationDetails: {
        reservationId: reservation.id,
        eventName: event.title,
        eventDate: formatEventDate(event.date, event.start_time),
        tableName,
        amountPaid: Number(reservation.prepayment_amount),
        qrCode: reservation.qr_code ?? reservation.id,
      },
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const supabase = getAdminSupabaseClient();
  const reservationIdFromMetadata = paymentIntent.metadata?.reservation_id;

  let { data: reservation } = await supabase
    .from("reservations")
    .select("id, event_table_id")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .maybeSingle();

  if (!reservation && reservationIdFromMetadata) {
    const metadataLookup = await supabase
      .from("reservations")
      .select("id, event_table_id")
      .eq("id", reservationIdFromMetadata)
      .maybeSingle();

    reservation = metadataLookup.data ?? null;
  }

  if (!reservation) {
    return;
  }

  await supabase
    .from("reservations")
    .update({
      status: "cancelled",
      cancellation_reason: "payment_failed",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", reservation.id);

  await supabase.from("event_tables").update({ status: "available" }).eq("id", reservation.event_table_id);
}

async function handleSubscriptionChanged(subscription: Stripe.Subscription): Promise<void> {
  const supabase = getAdminSupabaseClient();
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const tier = parseSubscriptionTier(subscription);
  const active = subscription.status === "active" || subscription.status === "trialing";

  await supabase
    .from("club_profiles")
    .update({
      subscription_tier: tier,
      subscription_active: active,
    })
    .eq("stripe_customer_id", customerId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const supabase = getAdminSupabaseClient();
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  await supabase
    .from("club_profiles")
    .update({
      subscription_tier: "starter",
      subscription_active: false,
    })
    .eq("stripe_customer_id", customerId);
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      if (event.data.object.object === "payment_intent") {
        await handlePaymentSucceeded(event.data.object);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      if (event.data.object.object === "payment_intent") {
        await handlePaymentFailed(event.data.object);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      if (event.data.object.object === "subscription") {
        await handleSubscriptionChanged(event.data.object);
      }
      break;
    }
    case "customer.subscription.deleted": {
      if (event.data.object.object === "subscription") {
        await handleSubscriptionDeleted(event.data.object);
      }
      break;
    }
    case "charge.refunded":
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
