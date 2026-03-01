// Component: ClubDashboardHomePage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: operational dashboard for club nightly activity

import { redirect } from "next/navigation";
import FloorPlan from "@/components/floor-plan/FloorPlan";
import RefreshButton from "./refreshButton";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

import type { ReactElement } from "react";

type EventTableRow = {
  id: string;
  status: "available" | "reserved" | "occupied" | "disabled" | "sold_out";
  dynamic_price: number | null;
  tables: {
    id: string;
    name: string;
    capacity: number;
    base_price: number;
    zone: string | null;
    x_position: number | null;
    y_position: number | null;
    is_promo: boolean;
  } | null;
};

type ReservationRow = {
  id: string;
  status: string;
  created_at: string;
  event_table_id: string;
  prepayment_amount: number;
  client_profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

type PromoterRow = {
  promoter_id: string | null;
  prepayment_amount: number;
  promoter_profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

type FloorPlanStatus = "available" | "reserved" | "occupied" | "selected" | "promo" | "disabled" | "sold_out";

function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function fullName(firstName?: string | null, lastName?: string | null): string {
  const value = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return value || "Client";
}

export default async function ClubDashboardHomePage(): Promise<ReactElement> {
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
  if (role !== "club" && role !== "admin") {
    redirect("/dashboard");
  }

  const { data: eventOfTonight, error: eventError } = await supabase
    .from("events")
    .select("id,title,start_time")
    .eq("club_id", user.id)
    .eq("status", "published")
    .eq("date", todayKey())
    .order("start_time", { ascending: true })
    .maybeSingle();

  if (eventError) {
    throw new Error("Impossible de charger la soirée du jour.");
  }

  if (!eventOfTonight) {
    return (
      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Dashboard Club</p>
        <h1 className="nt-heading mt-3 text-4xl text-[#F7F6F3]">Aucune soirée ce soir</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-[#888888]">
          Prépare la prochaine expérience VIP en publiant un nouvel événement NightTable.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <a
            href="/dashboard/club/events/new"
            className="nt-btn nt-btn-primary min-h-11 px-6 py-3 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
          >
            Créer un événement
          </a>
          <RefreshButton />
        </div>
      </section>
    );
  }

  const [{ data: eventTables }, { data: reservations }, { data: promoters }] = await Promise.all([
    supabase
      .from("event_tables")
      .select("id,status,dynamic_price,tables(id,name,capacity,base_price,zone,x_position,y_position,is_promo)")
      .eq("event_id", eventOfTonight.id),
    supabase
      .from("reservations")
      .select("id,status,created_at,event_table_id,prepayment_amount,client_profiles(first_name,last_name)")
      .eq("event_id", eventOfTonight.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("reservations")
      .select("promoter_id,prepayment_amount,promoter_profiles(first_name,last_name)")
      .eq("event_id", eventOfTonight.id)
      .not("promoter_id", "is", null),
  ]);

  const eventTablesList: EventTableRow[] = (eventTables ?? []) as EventTableRow[];
  const reservationsList: ReservationRow[] = (reservations ?? []) as ReservationRow[];
  const promotersList: PromoterRow[] = (promoters ?? []) as PromoterRow[];

  const tablesReserved = eventTablesList.filter((item) => item.status === "reserved" || item.status === "occupied");
  const tablesAvailable = eventTablesList.filter((item) => item.status === "available");

  const forecastRevenue = tablesReserved.reduce(
    (sum, table) => sum + Number(table.dynamic_price ?? table.tables?.base_price ?? 0),
    0
  );

  const guestsExpected = tablesReserved.reduce((sum, table) => sum + Number(table.tables?.capacity ?? 0), 0);

  const floorPlanTables: Array<{
    id: string;
    name: string;
    capacity: number;
    base_price: number;
    zone: string | null;
    position_x: number | null;
    position_y: number | null;
    status: FloorPlanStatus;
  }> = eventTablesList
    .filter((item) => item.tables)
    .map((item) => ({
      id: item.tables!.id,
      name: item.tables!.name,
      capacity: item.tables!.capacity,
      base_price: item.tables!.base_price,
      zone: item.tables!.zone,
      position_x: item.tables!.x_position,
      position_y: item.tables!.y_position,
      status: (item.tables!.is_promo && item.status === "available" ? "promo" : item.status) as FloorPlanStatus,
    }));

  const tableNameByEventTableId = new Map(
    eventTablesList
      .filter((item) => item.tables)
      .map((item) => [item.id, item.tables!.name])
  );

  const promoterMap = new Map<string, { name: string; guests: number; revenue: number }>();
  for (const promoter of promotersList) {
    if (!promoter.promoter_id) {
      continue;
    }

    const current = promoterMap.get(promoter.promoter_id);
    const promoterName = fullName(promoter.promoter_profiles?.first_name, promoter.promoter_profiles?.last_name);

    promoterMap.set(promoter.promoter_id, {
      name: promoterName,
      guests: (current?.guests ?? 0) + 1,
      revenue: (current?.revenue ?? 0) + Number(promoter.prepayment_amount ?? 0),
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Soirée du jour</p>
          <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3] md:text-4xl">{eventOfTonight.title}</h1>
          <p className="mt-2 text-sm text-[#888888]">Début: {eventOfTonight.start_time.slice(0, 5)}</p>
        </div>
        <RefreshButton />
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Tables réservées</p>
          <p className="mt-2 font-[Cormorant_Garamond] text-[48px] leading-none text-[#C9973A]">{tablesReserved.length}</p>
        </article>
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Tables disponibles</p>
          <p className="mt-2 font-[Cormorant_Garamond] text-[48px] leading-none text-[#C9973A]">{tablesAvailable.length}</p>
        </article>
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">CA prévisionnel</p>
          <p className="mt-2 font-[Cormorant_Garamond] text-[48px] leading-none text-[#C9973A]">{formatEuros(forecastRevenue)}</p>
        </article>
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Guests attendus</p>
          <p className="mt-2 font-[Cormorant_Garamond] text-[48px] leading-none text-[#C9973A]">{guestsExpected}</p>
        </article>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="nt-heading mb-4 text-2xl text-[#F7F6F3]">Plan de salle</h2>
        <FloorPlan tables={floorPlanTables} onTableSelect={() => undefined} mode="view" />
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="nt-heading mb-4 text-2xl text-[#F7F6F3]">Réservations du soir</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.12em] text-[#888888]">
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Table</th>
                <th className="px-3 py-2">Heure réservation</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reservationsList.map((reservation) => (
                <tr key={reservation.id} className="rounded-md bg-[#0A0F2E] text-[#F7F6F3]">
                  <td className="px-3 py-2">{fullName(reservation.client_profiles?.first_name, reservation.client_profiles?.last_name)}</td>
                  <td className="px-3 py-2">{tableNameByEventTableId.get(reservation.event_table_id) ?? "Table"}</td>
                  <td className="px-3 py-2">{new Date(reservation.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-3 py-2 capitalize">{reservation.status.replace("_", " ")}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="nt-btn nt-btn-secondary min-h-11 px-3 py-1.5 text-xs transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                    >
                      Check-in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="nt-heading mb-4 text-2xl text-[#F7F6F3]">Promoteurs actifs ce soir</h2>
        {promoterMap.size === 0 ? (
          <p className="text-sm text-[#888888]">Aucun promoteur actif pour le moment.</p>
        ) : (
          <div className="space-y-2">
            {Array.from(promoterMap.values()).map((promoter) => (
              <div key={promoter.name} className="flex items-center justify-between rounded-md border border-[#C9973A]/15 bg-[#0A0F2E] px-3 py-2">
                <p className="text-sm text-[#F7F6F3]">{promoter.name}</p>
                <p className="text-xs text-[#888888]">
                  Guests: <span className="text-[#F7F6F3]">{promoter.guests}</span> · CA: <span className="text-[#E8C96A]">{formatEuros(promoter.revenue)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
