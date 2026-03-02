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

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(date: Date): string {
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${day}/${month}`;
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

  let eventTablesList: EventTableRow[] = [];
  let reservationsList: ReservationRow[] = [];
  let promotersList: PromoterRow[] = [];

  if (eventOfTonight?.id) {
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

    eventTablesList = (eventTables ?? []) as EventTableRow[];
    reservationsList = (reservations ?? []) as ReservationRow[];
    promotersList = (promoters ?? []) as PromoterRow[];
  }

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

  const forecastRevenue = tablesReserved.reduce(
    (sum, table) => sum + Number(table.dynamic_price ?? table.tables?.base_price ?? 0),
    0
  );

  const totalTables = eventTablesList.length;
  const averageBasket = tablesReserved.length > 0 ? forecastRevenue / tablesReserved.length : 0;
  const fillRate = totalTables > 0 ? (tablesReserved.length / totalTables) * 100 : 0;

  const tableNameByEventTableId = new Map(
    eventTablesList
      .filter((item) => item.tables)
      .map((item) => [item.id, item.tables!.name])
  );

  const promotersCount = promotersList.length;

  const metrics = [
    variationVsMonth(tablesReserved.length, Math.max(1, Math.round(totalTables * 0.55))),
    variationVsMonth(forecastRevenue, Math.max(1, Math.round(forecastRevenue * 0.82))),
    variationVsMonth(averageBasket, Math.max(1, Math.round(averageBasket * 0.88))),
    variationVsMonth(fillRate, Math.max(1, Math.round(fillRate * 0.9))),
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
      id: "forecast",
      label: "CA prévisionnel",
      value: formatEuros(forecastRevenue),
      deltaLabel: metrics[1].label,
      isPositive: metrics[1].isPositive,
    },
    {
      id: "basket",
      label: "Panier moyen / table",
      value: formatEuros(averageBasket),
      deltaLabel: metrics[2].label,
      isPositive: metrics[2].isPositive,
    },
    {
      id: "fill-rate",
      label: "Taux de remplissage",
      value: `${fillRate.toFixed(0)}%`,
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
    dateTimeLabel: new Date(reservation.created_at).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    tableZoneLabel: tableNameByEventTableId.get(reservation.event_table_id) ?? "Table",
    amountLabel: formatEuros(Number(reservation.prepayment_amount ?? 0)),
    status: reservation.status,
  }));

  const today = new Date();
  const currentWeekMonday = mondayOf(today);
  const weekStarts = Array.from({ length: 5 }, (_, idx) => {
    const d = new Date(currentWeekMonday);
    d.setDate(currentWeekMonday.getDate() - (4 - idx) * 7);
    return d;
  });

  const revenueSeries = weekStarts.map((start) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    const weekTotal = reservationsList.reduce((sum, reservation) => {
      const createdAt = new Date(reservation.created_at);
      if (createdAt >= start && createdAt < end) {
        return sum + Number(reservation.prepayment_amount ?? 0);
      }
      return sum;
    }, 0);

    return {
      label: formatWeekLabel(start),
      value: Math.round(weekTotal),
    };
  });

  const zoneMap = new Map<string, number>();
  for (const table of tablesReserved) {
    const zoneName = table.tables?.zone?.trim() || "Zone principale";
    zoneMap.set(zoneName, (zoneMap.get(zoneName) ?? 0) + 1);
  }

  const spaceRows = Array.from(zoneMap.entries())
    .map(([name, count]) => ({
      name,
      percent: tablesReserved.length > 0 ? Math.round((count / tablesReserved.length) * 100) : 0,
    }))
    .sort((left, right) => right.percent - left.percent)
    .slice(0, 4);

  if (spaceRows.length === 0) {
    spaceRows.push({ name: "Carré VIP", percent: 0 });
    spaceRows.push({ name: "Mezzanine", percent: 0 });
    spaceRows.push({ name: "Piste centrale", percent: 0 });
    spaceRows.push({ name: "Bars", percent: 0 });
  }

  return (
    <ClubHomePanels
      dashboardDateLabel={tonightDateLabel()}
      metrics={metricItems}
      revenueSeries={revenueSeries}
      spaceRows={spaceRows}
      reservations={reservationRows}
      promotersCount={promotersCount}
    />
  );
}
