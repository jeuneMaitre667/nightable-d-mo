// Component: ClientReservationsPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon table pattern
// NightTable usage: Client reservation history and actions

import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { cancelReservationAction, createResaleListingAction } from "@/lib/reservation.actions";
import { createClient } from "@/lib/supabase/server";
import { ClientReservationsTable } from "./ClientReservationsTable";

type ReservationRow = {
  id: string;
  event_id: string;
  event_table_id: string;
  status: string;
  event_starts_at: string;
  prepayment_amount: number;
  created_at: string;
};

type EventRow = {
  id: string;
  title: string;
  club_id: string;
};

type ClubRow = {
  id: string;
  club_name: string;
};

type EventTableRow = {
  id: string;
  table: { name: string } | { name: string }[] | null;
};

function statusLabel(status: string): string {
  if (status === "confirmed") return "Confirmée";
  if (status === "cancelled") return "Annulée";
  if (status === "payment_pending") return "Paiement en attente";
  if (status === "reserved") return "Réservée";
  return status;
}

async function cancelReservationFormAction(formData: FormData): Promise<void> {
  "use server";
  await cancelReservationAction(formData);
}

async function createResaleListingFormAction(formData: FormData): Promise<void> {
  "use server";
  await createResaleListingAction(formData);
}

export default async function ClientReservationsPage() {
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

  const { data: rawReservations } = await supabase
    .from("reservations")
    .select("id, event_id, event_table_id, status, event_starts_at, prepayment_amount, created_at")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const reservations = (rawReservations ?? []) as ReservationRow[];
  const eventIds = Array.from(new Set(reservations.map((reservation) => reservation.event_id)));
  const tableIds = Array.from(
    new Set(reservations.map((reservation) => reservation.event_table_id).filter(Boolean))
  );

  const { data: rawEvents } = eventIds.length
    ? await supabase.from("events").select("id, title, club_id").in("id", eventIds)
    : { data: [] as EventRow[] };

  const events = (rawEvents ?? []) as EventRow[];
  const clubIds = Array.from(new Set(events.map((eventItem) => eventItem.club_id)));

  const { data: rawClubs } = clubIds.length
    ? await supabase.from("club_profiles").select("id, club_name").in("id", clubIds)
    : { data: [] as ClubRow[] };

  const clubs = (rawClubs ?? []) as ClubRow[];

  const { data: rawTables } = tableIds.length
    ? await supabase.from("event_tables").select("id, table:tables(name)").in("id", tableIds)
    : { data: [] as EventTableRow[] };

  const tables = (rawTables ?? []) as EventTableRow[];

  const eventById = new Map(events.map((eventItem) => [eventItem.id, eventItem]));
  const clubById = new Map(clubs.map((club) => [club.id, club.club_name]));
  const tableNameByEventTableId = new Map(
    tables.map((eventTable) => {
      const relation = eventTable.table;
      const tableName = Array.isArray(relation) ? relation[0]?.name : relation?.name;
      return [eventTable.id, tableName ?? "Table"];
    })
  );
  const nowTimestamp = new Date().getTime();
  const reservationRows = reservations.map((reservation) => {
    const event = eventById.get(reservation.event_id);
    const clubName = event ? clubById.get(event.club_id) : "Club";
    const tableName = tableNameByEventTableId.get(reservation.event_table_id) ?? "Table";
    const eventStart = new Date(reservation.event_starts_at).getTime();

    return {
      id: reservation.id,
      eventTitle: event?.title ?? "Événement",
      clubName: clubName ?? "Club",
      dateLabel: new Date(reservation.event_starts_at).toLocaleString("fr-FR"),
      tableName,
      status: reservation.status,
      statusLabel: statusLabel(reservation.status),
      canResell: reservation.status === "confirmed" && eventStart > nowTimestamp + 3 * 60 * 60 * 1000,
      canCancel: eventStart > nowTimestamp + 48 * 60 * 60 * 1000,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Mes réservations</h1>
        <p className="text-sm text-[#888888]">
          Revendez si votre événement est à plus de 3h ou annulez jusqu’à 48h avant.
        </p>
      </div>

      <ClientReservationsTable
        reservations={reservationRows}
        cancelReservationFormAction={cancelReservationFormAction}
        createResaleListingFormAction={createResaleListingFormAction}
      />
    </div>
  );
}
