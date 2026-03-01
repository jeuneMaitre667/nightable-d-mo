// Component: ClientDashboardHomePage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris dashboard summary pattern
// NightTable usage: Client dashboard home

import Link from "next/link";
import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

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
  if (score >= 70) return "#3A9C6B";
  if (score >= 40) return "#C9973A";
  return "#C4567A";
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
  const scoreColor = scoreTone(score);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">
          Bonjour {client.first_name ?? ""}
        </h1>
        <p className="text-sm text-[#888888]">Voici votre dashboard NightTable.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#888888]">NightTable Score</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-4xl font-semibold" style={{ color: scoreColor }}>
              {score}
            </p>
            <p className="pb-1 text-sm text-[#888888]">/ 100</p>
          </div>
          <div className="mt-4 h-3 w-full rounded-full bg-[#0A0F2E]">
            <div
              className="h-3 rounded-full transition-all duration-200 ease-in-out"
              style={{ width: `${score}%`, backgroundColor: scoreColor }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#888888]">Prochaine réservation</p>
          {nextReservation && nextEvent ? (
            <div className="mt-3 space-y-1">
              <p className="text-lg font-semibold text-[#F7F6F3]">{nextEvent.title}</p>
              <p className="text-sm text-[#888888]">{nextClub?.club_name ?? "Club"}</p>
              <p className="text-sm text-[#888888]">
                {new Date(nextReservation.event_starts_at).toLocaleString("fr-FR")}
              </p>
              <p className="text-sm text-[#888888]">{nextTableName ? `Table ${nextTableName}` : "Table"}</p>
              <p className="text-sm text-[#C9973A]">
                Acompte: {Number(nextReservation.prepayment_amount).toFixed(2)} €
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#888888]">Aucune réservation à venir.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-5">
        <p className="text-[11px] uppercase tracking-widest text-[#888888]">Raccourcis</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/clubs"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/40 px-4 py-2 text-sm font-semibold text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10"
          >
            Explorer les clubs
          </Link>
          <Link
            href="/dashboard/client/reservations"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110"
          >
            Mes réservations
          </Link>
        </div>
      </div>
    </div>
  );
}
