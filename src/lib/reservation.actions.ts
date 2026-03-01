"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

import type { ActionResult } from "@/types";

type CreateReservationInput = {
  eventId: string;
  eventTableId: string;
  guestsCount: number;
  firstName: string;
  lastName: string;
  phone: string;
  includeInsurance: boolean;
  specialRequests?: string;
};

const createReservationSchema = z.object({
  eventId: z.string().uuid(),
  eventTableId: z.string().uuid(),
  guestsCount: z.number().int().min(1).max(30),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(6).max(30),
  includeInsurance: z.boolean(),
  specialRequests: z.string().trim().max(500).optional(),
});

type ReservationContext = {
  userId: string;
  email: string;
};

async function getReservationContext(): Promise<ActionResult<ReservationContext>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return { success: false, error: "Session invalide." };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return { success: false, error: "Profil introuvable." };
    }

    const role = normalizeRole(profile.role);
    if (role !== "client" && role !== "female_vip") {
      return { success: false, error: "Action non autorisée." };
    }

    return {
      success: true,
      data: {
        userId: user.id,
        email: user.email,
      },
    };
  } catch {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}

function resolveInsuranceAmount(includeInsurance: boolean): number {
  return includeInsurance ? 5 : 0;
}

export async function createReservationAction(
  input: CreateReservationInput
): Promise<ActionResult<{ reservationId: string; clientSecret: string }>> {
  const parsed = createReservationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Formulaire réservation invalide." };
  }

  const contextResult = await getReservationContext();
  if (!contextResult.success || !contextResult.data) {
    return { success: false, error: contextResult.error ?? "Action non autorisée." };
  }

  try {
    const supabase = await createClient();
    const stripe = getStripe();

    const { data: eventTable, error: eventTableError } = await supabase
      .from("event_tables")
      .select(
        `
          id,
          status,
          event_id,
          dynamic_price,
          table:tables(id, base_price, capacity),
          event:events(id, title, club_id, date, start_time)
        `
      )
      .eq("id", parsed.data.eventTableId)
      .eq("event_id", parsed.data.eventId)
      .maybeSingle();

    if (eventTableError || !eventTable) {
      return { success: false, error: "Table introuvable." };
    }

    if (eventTable.status !== "available") {
      return { success: false, error: "Cette table n’est plus disponible." };
    }

    const table = Array.isArray(eventTable.table) ? eventTable.table[0] : eventTable.table;
    const event = Array.isArray(eventTable.event) ? eventTable.event[0] : eventTable.event;

    if (!table || !event) {
      return { success: false, error: "Données événement/table indisponibles." };
    }

    if (parsed.data.guestsCount > table.capacity) {
      return { success: false, error: "Le nombre d’invités dépasse la capacité de la table." };
    }

    const baseAmount = Number(eventTable.dynamic_price ?? table.base_price);
    const prepaymentPercent = 40;
    const prepaymentAmount = Math.round((baseAmount * prepaymentPercent) / 100);
    const insurancePrice = resolveInsuranceAmount(parsed.data.includeInsurance);
    const amountNow = prepaymentAmount + insurancePrice;

    const { data: lockData, error: lockError } = await supabase
      .from("event_tables")
      .update({ status: "reserved" })
      .eq("id", eventTable.id)
      .eq("status", "available")
      .select("id")
      .maybeSingle();

    if (lockError || !lockData) {
      return { success: false, error: "Cette table vient d’être réservée. Veuillez en choisir une autre." };
    }

    const eventStartsAt = `${event.date}T${event.start_time}`;

    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert({
        client_id: contextResult.data.userId,
        event_id: event.id,
        event_table_id: eventTable.id,
        promoter_id: null,
        promo_code_used: null,
        status: "payment_pending",
        minimum_consumption: baseAmount,
        dynamic_price_at_booking: baseAmount,
        prepayment_percent: prepaymentPercent,
        prepayment_amount: prepaymentAmount,
        insurance_purchased: parsed.data.includeInsurance,
        insurance_price: insurancePrice,
        event_starts_at: eventStartsAt,
        qr_code: `NT-${randomUUID()}`,
        guests_count: parsed.data.guestsCount,
        special_requests: parsed.data.specialRequests || null,
        contact_phone: parsed.data.phone,
        client_first_name: parsed.data.firstName,
        client_last_name: parsed.data.lastName,
      })
      .select("id")
      .single();

    if (reservationError || !reservation) {
      await supabase.from("event_tables").update({ status: "available" }).eq("id", eventTable.id);
      return { success: false, error: "Impossible de créer la réservation pour le moment." };
    }

    try {
      const promoCookie = (await cookies()).get("nighttable_promo")?.value?.trim();

      if (promoCookie) {
        const { data: promoter } = await supabase
          .from("promoter_profiles")
          .select("id, promo_code")
          .eq("promo_code", promoCookie)
          .eq("is_active", true)
          .maybeSingle();

        if (promoter) {
          await supabase.from("promoter_clicks").insert({
            promoter_id: promoter.id,
            promo_code: promoter.promo_code,
            converted: true,
            reservation_id: reservation.id,
          });

          await supabase
            .from("reservations")
            .update({
              promoter_id: promoter.id,
              promo_code_used: promoter.promo_code,
            })
            .eq("id", reservation.id);
        }
      }
    } catch (error) {
      console.error("[createReservationAction] promoter attribution failed", error);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountNow * 100,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      receipt_email: contextResult.data.email,
      metadata: {
        reservation_id: reservation.id,
        event_id: event.id,
        event_table_id: eventTable.id,
        client_id: contextResult.data.userId,
      },
    });

    if (!paymentIntent.client_secret) {
      await supabase.from("reservations").update({ status: "cancelled" }).eq("id", reservation.id);
      await supabase.from("event_tables").update({ status: "available" }).eq("id", eventTable.id);
      return { success: false, error: "Impossible d'initialiser le paiement." };
    }

    const { error: paymentLinkError } = await supabase
      .from("reservations")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", reservation.id);

    if (paymentLinkError) {
      await supabase.from("reservations").update({ status: "cancelled" }).eq("id", reservation.id);
      await supabase.from("event_tables").update({ status: "available" }).eq("id", eventTable.id);
      return { success: false, error: "Impossible de lier le paiement à la réservation." };
    }

    return {
      success: true,
      data: {
        reservationId: reservation.id,
        clientSecret: paymentIntent.client_secret,
      },
    };
  } catch {
    return { success: false, error: "Une erreur est survenue. Merci de réessayer." };
  }
}
