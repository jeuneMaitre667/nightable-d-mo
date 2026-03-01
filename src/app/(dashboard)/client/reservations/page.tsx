// Component: ClientReservationsPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon table pattern
// NightTable usage: Client reservation history and actions

import Link from "next/link";
import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { cancelReservationAction } from "@/lib/reservation.actions";
import { createClient } from "@/lib/supabase/server";

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

function statusBadge(status: string): string {
  if (status === "confirmed") {
    return "border border-[#3A9C6B]/30 bg-[#3A9C6B]/15 text-[#3A9C6B]";
  }

  if (status === "cancelled") {
    return "border border-[#C4567A]/30 bg-[#C4567A]/15 text-[#C4567A]";
  }

  return "border border-[#C9973A]/30 bg-[#C9973A]/15 text-[#C9973A]";
}

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Mes réservations</h1>
        <p className="text-sm text-[#888888]">
          Revendez si votre événement est à plus de 3h ou annulez jusqu’à 48h avant.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Aucune réservation pour le moment</h2>
          <p className="mt-2 text-sm text-[#888888]">
            Découvrez les meilleures soirées à Paris et réservez votre première table.
          </p>
          <Link
            href="/clubs"
            className="mt-5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110"
          >
            Voir les clubs
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#C9973A]/10">
          <table className="w-full">
            <thead className="bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]">
              <tr>
                <th className="px-4 py-3 text-left">Événement</th>
                <th className="px-4 py-3 text-left">Club</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Table</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                const event = eventById.get(reservation.event_id);
                const clubName = event ? clubById.get(event.club_id) : "Club";
                const tableName = tableNameByEventTableId.get(reservation.event_table_id) ?? "Table";
                const eventStart = new Date(reservation.event_starts_at).getTime();
                const canResell =
                  reservation.status === "confirmed" &&
                  eventStart > nowTimestamp + 3 * 60 * 60 * 1000;
                const canCancel = eventStart > nowTimestamp + 48 * 60 * 60 * 1000;

                return (
                  <tr
                    key={reservation.id}
                    className="border-t border-[#C9973A]/5 bg-[#12172B] text-sm text-[#F7F6F3]"
                  >
                    <td className="px-4 py-3">{event?.title ?? "Événement"}</td>
                    <td className="px-4 py-3 text-[#888888]">{clubName ?? "Club"}</td>
                    <td className="px-4 py-3 text-[#888888]">
                      {new Date(reservation.event_starts_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-[#888888]">{tableName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusBadge(reservation.status)}`}
                      >
                        {statusLabel(reservation.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={!canResell}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/40 px-3 py-2 text-xs font-semibold text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Revendre
                        </button>
                        <form action={cancelReservationFormAction}>
                          <input type="hidden" name="reservation_id" value={reservation.id} />
                          <button
                            type="submit"
                            disabled={!canCancel}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C4567A]/40 px-3 py-2 text-xs font-semibold text-[#C4567A] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Annuler
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
