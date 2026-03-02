// Component: ClientDashboardHomePage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris dashboard summary pattern
// NightTable usage: Client dashboard home

import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ClientDashboardPanels } from "./ClientDashboardPanels";

type ClientProfileRow = {
  first_name: string | null;
  nighttable_score: number;
};

type ReservationRow = {
  id: string;
  event_id: string;
  event_table_id: string;
  status: string;
  event_starts_at: string;
  prepayment_amount: number;
};

type EventRow = {
  id: string;
  title: string;
  club_id: string;
};

type ClubRow = {
  club_name: string;
};

type EventTableRow = {
  table: { name: string } | { name: string }[] | null;
};

function scoreTone(score: number): string {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export default async function ClientDashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  if (role !== "client" && role !== "female_vip" && role !== "admin") {
    redirect("/dashboard");
  }

  const { data: clientProfile } = await supabase
    .from("client_profiles")
    .select("first_name, nighttable_score")
    .eq("id", user.id)
    .maybeSingle();

  const client = (clientProfile as ClientProfileRow | null) ?? {
    first_name: null,
    nighttable_score: 50,
  };

  const { data: nextReservationRow } = await supabase
    .from("reservations")
    .select("id, event_id, event_table_id, status, event_starts_at, prepayment_amount")
    .eq("client_id", user.id)
    .in("status", ["confirmed", "reserved", "payment_pending"])
    .gte("event_starts_at", new Date().toISOString())
    .order("event_starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const nextReservation = nextReservationRow as ReservationRow | null;

  let nextEvent: EventRow | null = null;
  let nextClub: ClubRow | null = null;
  let nextTableName: string | null = null;

  if (nextReservation) {
    const { data: eventRow } = await supabase
      .from("events")
      .select("id, title, club_id")
      .eq("id", nextReservation.event_id)
      .maybeSingle();

    nextEvent = (eventRow as EventRow | null) ?? null;

    if (nextEvent?.club_id) {
      const { data: clubRow } = await supabase
        .from("club_profiles")
        .select("club_name")
        .eq("id", nextEvent.club_id)
        .maybeSingle();

      nextClub = (clubRow as ClubRow | null) ?? null;
    }

    if (nextReservation.event_table_id) {
      const { data: eventTableRow } = await supabase
        .from("event_tables")
        .select("table:tables(name)")
        .eq("id", nextReservation.event_table_id)
        .maybeSingle();

      const typedEventTable = eventTableRow as EventTableRow | null;
      const tableRelation = typedEventTable?.table ?? null;
      nextTableName = Array.isArray(tableRelation)
        ? tableRelation[0]?.name ?? null
        : tableRelation?.name ?? null;
    }
  }

  const score = Math.max(0, Math.min(100, Number(client.nighttable_score ?? 50)));
  const scoreToneValue = scoreTone(score) as "high" | "medium" | "low";
  const nextReservationData = nextReservation && nextEvent
    ? {
        eventTitle: nextEvent.title,
        clubName: nextClub?.club_name ?? "Club",
        dateLabel: new Date(nextReservation.event_starts_at).toLocaleString("fr-FR"),
        tableLabel: nextTableName ? `Table ${nextTableName}` : "Table",
        prepaymentLabel: `${Number(nextReservation.prepayment_amount).toFixed(2)} €`,
      }
    : null;

  return (
    <ClientDashboardPanels
      firstName={client.first_name ?? ""}
      score={score}
      scoreTone={scoreToneValue}
      nextReservation={nextReservationData}
    />
  );
}
