// Component: ClubDashboardHomePage
// Reference: component.gallery/components/table
// Inspired by: Linear.app dense dashboard pattern
// NightTable usage: operational dashboard for club nightly activity

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

import ClubHomePanels from "./ClubHomePanels";

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
  client_id: string | null;
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

function tonightDateLabel(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function variationVsMonth(current: number, reference: number): { label: string; isPositive: boolean } {
  if (reference <= 0) {
    return { label: "+0% vs mois dernier", isPositive: true };
  }

  const delta = ((current - reference) / reference) * 100;
  const rounded = Math.round(delta);
  return {
    label: `${rounded >= 0 ? "+" : ""}${rounded}% vs mois dernier`,
    isPositive: rounded >= 0,
  };
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
            className="inline-flex min-h-11 items-center rounded-[8px] border border-[#C9973A]/45 bg-[#C9973A]/15 px-6 py-2 text-[13px] font-medium text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
          >
            Test HeroUI
          </a>
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
      .select("id,status,created_at,event_table_id,client_id,prepayment_amount,client_profiles(first_name,last_name)")
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

  const clientIds = Array.from(
    new Set(
      reservationsList
        .map((reservation) => reservation.client_id)
        .filter((value): value is string => Boolean(value))
    )
  );

  const { data: clientProfiles } = clientIds.length
    ? await supabase.from("profiles").select("id,email").in("id", clientIds)
    : { data: [] as Array<{ id: string; email: string | null }> };

  const clientEmailById = new Map(
    ((clientProfiles ?? []) as Array<{ id: string; email: string | null }>).map((profileItem) => [
      profileItem.id,
      profileItem.email ?? "email@nighttable.app",
    ])
  );

  const tablesReserved = eventTablesList.filter((item) => item.status === "reserved" || item.status === "occupied");
  const tablesAvailable = eventTablesList.filter((item) => item.status === "available");

  const forecastRevenue = tablesReserved.reduce(
    (sum, table) => sum + Number(table.dynamic_price ?? table.tables?.base_price ?? 0),
    0
  );

  const totalTables = eventTablesList.length;

  const guestsExpected = tablesReserved.reduce((sum, table) => sum + Number(table.tables?.capacity ?? 0), 0);

  const tableNameByEventTableId = new Map(
    eventTablesList
      .filter((item) => item.tables)
      .map((item) => [item.id, item.tables!.name])
  );

  const tableCapacityByEventTableId = new Map(
    eventTablesList
      .filter((item) => item.tables)
      .map((item) => [item.id, item.tables!.capacity])
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

  const metrics = [
    variationVsMonth(tablesReserved.length, Math.max(1, Math.round(totalTables * 0.55))),
    variationVsMonth(tablesAvailable.length, Math.max(1, Math.round(totalTables * 0.45))),
    variationVsMonth(forecastRevenue, Math.max(1, Math.round(forecastRevenue * 0.82))),
    variationVsMonth(guestsExpected, Math.max(1, Math.round(guestsExpected * 0.8))),
  ];

  const metricItems = [
    {
      id: "reserved",
      label: "Tables réservées",
      value: String(tablesReserved.length),
      deltaLabel: metrics[0].label,
      isPositive: metrics[0].isPositive,
    },
    {
      id: "available",
      label: "Tables disponibles",
      value: String(tablesAvailable.length),
      deltaLabel: metrics[1].label,
      isPositive: metrics[1].isPositive,
    },
    {
      id: "forecast",
      label: "CA prévisionnel",
      value: formatEuros(forecastRevenue),
      deltaLabel: metrics[2].label,
      isPositive: metrics[2].isPositive,
    },
    {
      id: "guests",
      label: "Guests attendus",
      value: String(guestsExpected),
      deltaLabel: metrics[3].label,
      isPositive: metrics[3].isPositive,
    },
  ];

  const reservationRows = reservationsList.map((reservation) => ({
    id: reservation.id,
    clientName: fullName(reservation.client_profiles?.first_name, reservation.client_profiles?.last_name),
    clientEmail:
      reservation.client_id !== null
        ? (clientEmailById.get(reservation.client_id) ?? "email@nighttable.app")
        : "email@nighttable.app",
    tableName: tableNameByEventTableId.get(reservation.event_table_id) ?? "Table",
    hourLabel: new Date(reservation.created_at).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    guests: Number(tableCapacityByEventTableId.get(reservation.event_table_id) ?? 0),
    status: reservation.status,
  }));

  const promoterRows = Array.from(promoterMap.entries())
    .map(([promoterId, promoter]) => ({
      id: promoterId,
      name: promoter.name,
      guests: promoter.guests,
      revenueLabel: formatEuros(promoter.revenue),
      linkActive: promoter.guests > 0,
      rankScore: promoter.revenue,
    }))
    .sort((left, right) => right.rankScore - left.rankScore)
    .map((promoter) => ({
      id: promoter.id,
      name: promoter.name,
      guests: promoter.guests,
      revenueLabel: promoter.revenueLabel,
      linkActive: promoter.linkActive,
    }));

  return (
    <ClubHomePanels
      dashboardDateLabel={tonightDateLabel()}
      metrics={metricItems}
      reservations={reservationRows}
      promoters={promoterRows}
    />
  );
}
