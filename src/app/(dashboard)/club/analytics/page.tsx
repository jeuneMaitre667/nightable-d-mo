// Component: ClubAnalyticsPage
// Reference: component.gallery/components/tabs + component.gallery/components/table
// Inspired by: IBM Carbon analytics dashboard pattern
// NightTable usage: club analytics dashboard with period filters and KPI tables

import { redirect } from "next/navigation";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsPanels } from "./AnalyticsPanels";

import type { ReactElement } from "react";

type PeriodKey = "7d" | "30d" | "3m" | "all";

type EventAnalyticsRow = {
  id: string;
  title: string;
  date: string;
};

type ReservationAnalyticsRow = {
  id: string;
  status: string;
  prepayment_amount: number | null;
  created_at: string;
  event_id: string;
  event_table_id: string | null;
  promoter_id: string | null;
};

type EventTableRow = {
  id: string;
  event_id: string;
  table_id: string;
};

type TableRow = {
  id: string;
  name: string;
};

type PromoterRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

type CommissionRow = {
  promoter_id: string;
  amount: number | null;
  status: "pending" | "validated" | "paid";
};

function periodStartDate(period: PeriodKey): Date | null {
  const now = new Date();
  if (period === "7d") {
    const date = new Date(now);
    date.setDate(date.getDate() - 7);
    return date;
  }

  if (period === "30d") {
    const date = new Date(now);
    date.setDate(date.getDate() - 30);
    return date;
  }

  if (period === "3m") {
    const date = new Date(now);
    date.setMonth(date.getMonth() - 3);
    return date;
  }

  return null;
}

function previousWindowStart(period: PeriodKey): { start: Date | null; end: Date | null } {
  const now = new Date();
  if (period === "7d") {
    const end = new Date(now);
    end.setDate(end.getDate() - 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    return { start, end };
  }

  if (period === "30d") {
    const end = new Date(now);
    end.setDate(end.getDate() - 30);
    const start = new Date(end);
    start.setDate(start.getDate() - 30);
    return { start, end };
  }

  if (period === "3m") {
    const end = new Date(now);
    end.setMonth(end.getMonth() - 3);
    const start = new Date(end);
    start.setMonth(start.getMonth() - 3);
    return { start, end };
  }

  return { start: null, end: null };
}

function getVariation(current: number, previous: number | null): number | null {
  if (previous === null || previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
}

export default async function ClubAnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string }>;
}): Promise<ReactElement> {
  const params = await searchParams;
  const requestedPeriod = params?.period;
  const period: PeriodKey =
    requestedPeriod === "7d" || requestedPeriod === "30d" || requestedPeriod === "3m" || requestedPeriod === "all"
      ? requestedPeriod
      : "30d";

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

  const clubId = user.id;
  const startDate = periodStartDate(period);
  const previousWindow = previousWindowStart(period);

  let eventsQuery = supabase
    .from("events")
    .select("id,title,date")
    .eq("club_id", clubId)
    .order("date", { ascending: false })
    .limit(200);

  if (startDate) {
    eventsQuery = eventsQuery.gte("date", startDate.toISOString().slice(0, 10));
  }

  let reservationsQuery = supabase
    .from("reservations")
    .select("id,status,prepayment_amount,created_at,event_id,event_table_id,promoter_id")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (startDate) {
    reservationsQuery = reservationsQuery.gte("created_at", startDate.toISOString());
  }

  const previousReservationsPromise =
    previousWindow.start && previousWindow.end
      ? supabase
          .from("reservations")
          .select("id,prepayment_amount")
          .eq("club_id", clubId)
          .gte("created_at", previousWindow.start.toISOString())
          .lt("created_at", previousWindow.end.toISOString())
      : Promise.resolve({ data: [] as Array<{ id: string; prepayment_amount: number | null }>, error: null });

  const [eventsResult, reservationsResult, previousReservationsResult] = await Promise.all([
    eventsQuery,
    reservationsQuery,
    previousReservationsPromise,
  ]);

  const events = (eventsResult.data ?? []) as EventAnalyticsRow[];
  const reservations = (reservationsResult.data ?? []) as ReservationAnalyticsRow[];
  const previousReservations =
    (previousReservationsResult.data ?? []) as Array<{ id: string; prepayment_amount: number | null }>;

  const eventIds = Array.from(new Set(events.map((eventItem) => eventItem.id)));
  const eventTableIds = Array.from(
    new Set(
      reservations
        .map((reservation) => reservation.event_table_id)
        .filter((value): value is string => Boolean(value))
    )
  );
  const promoterIds = Array.from(
    new Set(
      reservations
        .map((reservation) => reservation.promoter_id)
        .filter((value): value is string => Boolean(value))
    )
  );

  const [eventTablesResult, reservationEventTablesResult, promotersResult, commissionsResult] = await Promise.all([
    eventIds.length
      ? supabase.from("event_tables").select("id,event_id,table_id").in("event_id", eventIds)
      : Promise.resolve({ data: [] as EventTableRow[], error: null }),
    eventTableIds.length
      ? supabase.from("event_tables").select("id,table_id").in("id", eventTableIds)
      : Promise.resolve({ data: [] as Array<{ id: string; table_id: string }>, error: null }),
    promoterIds.length
      ? supabase.from("promoter_profiles").select("id,first_name,last_name").in("id", promoterIds)
      : Promise.resolve({ data: [] as PromoterRow[], error: null }),
    promoterIds.length
      ? supabase
          .from("commissions")
          .select("promoter_id,amount,status")
          .eq("club_id", clubId)
          .in("promoter_id", promoterIds)
      : Promise.resolve({ data: [] as CommissionRow[], error: null }),
  ]);

  const eventTables = (eventTablesResult.data ?? []) as EventTableRow[];
  const reservationEventTables =
    (reservationEventTablesResult.data ?? []) as Array<{ id: string; table_id: string }>;
  const tableIds = Array.from(
    new Set(reservationEventTables.map((item) => item.table_id).filter((id): id is string => Boolean(id)))
  );
  const tablesResult = tableIds.length
    ? await supabase.from("tables").select("id,name").in("id", tableIds)
    : { data: [] as TableRow[] };

  const eventTableById = new Map(eventTables.map((item) => [item.id, item]));
  const tableById = new Map(((tablesResult.data ?? []) as TableRow[]).map((item) => [item.id, item.name]));
  const promoterById = new Map(
    ((promotersResult.data ?? []) as PromoterRow[]).map((item) => [
      item.id,
      `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Promoteur",
    ])
  );

  const revenueTotal = reservations.reduce(
    (sum, reservation) => sum + Number(reservation.prepayment_amount ?? 0),
    0
  );
  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "confirmed" || reservation.status === "checked_in"
  ).length;
  const noShowCount = reservations.filter((reservation) => reservation.status === "no_show").length;
  const noShowRate = reservations.length > 0 ? (noShowCount / reservations.length) * 100 : 0;
  const previousRevenue = previousReservations.reduce(
    (sum, reservation) => sum + Number(reservation.prepayment_amount ?? 0),
    0
  );

  const revenueByTable = new Map<string, number>();
  for (const reservation of reservations) {
    if (!reservation.event_table_id) {
      continue;
    }

    const eventTable = eventTableById.get(reservation.event_table_id);
    if (!eventTable?.table_id) {
      continue;
    }

    const current = revenueByTable.get(eventTable.table_id) ?? 0;
    revenueByTable.set(eventTable.table_id, current + Number(reservation.prepayment_amount ?? 0));
  }

  const bestTableEntry = Array.from(revenueByTable.entries()).sort((a, b) => b[1] - a[1])[0];
  const mostProfitableTable = bestTableEntry
    ? `${tableById.get(bestTableEntry[0]) ?? "Table"} (${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(bestTableEntry[1])})`
    : "—";

  const promoterStatsMap = new Map<string, { reservations: number; revenue: number; paidCommission: number }>();
  for (const reservation of reservations) {
    if (!reservation.promoter_id) {
      continue;
    }

    const current = promoterStatsMap.get(reservation.promoter_id) ?? {
      reservations: 0,
      revenue: 0,
      paidCommission: 0,
    };

    current.reservations += 1;
    current.revenue += Number(reservation.prepayment_amount ?? 0);
    promoterStatsMap.set(reservation.promoter_id, current);
  }

  for (const commission of (commissionsResult.data ?? []) as CommissionRow[]) {
    if (!commission.promoter_id) {
      continue;
    }

    const current = promoterStatsMap.get(commission.promoter_id) ?? {
      reservations: 0,
      revenue: 0,
      paidCommission: 0,
    };

    if (commission.status === "paid") {
      current.paidCommission += Number(commission.amount ?? 0);
    }

    promoterStatsMap.set(commission.promoter_id, current);
  }

  const promoterRows = Array.from(promoterStatsMap.entries())
    .map(([promoterId, stats]) => ({
      promoterId,
      promoterName: promoterById.get(promoterId) ?? "Promoteur",
      reservations: stats.reservations,
      revenue: stats.revenue,
      paidCommission: stats.paidCommission,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

  const bestPromoter = promoterRows[0]?.promoterName ?? "—";

  const eventsById = new Map(events.map((eventItem) => [eventItem.id, eventItem]));
  const eventRows = events
    .map((eventItem) => {
      const eventReservations = reservations.filter((reservation) => reservation.event_id === eventItem.id);
      const soldTableIds = new Set(
        eventReservations
          .filter((reservation) => reservation.status !== "cancelled")
          .map((reservation) => reservation.event_table_id)
          .filter((value): value is string => Boolean(value))
      );
      const eventRevenue = eventReservations.reduce(
        (sum, reservation) => sum + Number(reservation.prepayment_amount ?? 0),
        0
      );
      const eventNoShows = eventReservations.filter((reservation) => reservation.status === "no_show").length;
      const eventNoShowRate = eventReservations.length > 0 ? (eventNoShows / eventReservations.length) * 100 : 0;

      return {
        eventId: eventItem.id,
        eventTitle: eventItem.title,
        dateLabel: new Date(eventItem.date).toLocaleDateString("fr-FR"),
        soldTables: soldTableIds.size,
        revenue: eventRevenue,
        noShowRate: eventNoShowRate,
        averageRating: null as number | null,
      };
    })
    .sort((a, b) => {
      const left = eventsById.get(a.eventId)?.date ?? "";
      const right = eventsById.get(b.eventId)?.date ?? "";
      return right.localeCompare(left);
    })
    .slice(0, 20);

  const averageClientRating: number | null = null;

  const metrics = {
    revenueTotal,
    confirmedReservations,
    noShowRate,
    mostProfitableTable,
    bestPromoter,
    averageClientRating,
    variations: {
      revenueTotal: getVariation(revenueTotal, previousRevenue),
      confirmedReservations: getVariation(
        confirmedReservations,
        previousWindow.start && previousWindow.end ? previousReservations.length : null
      ),
      noShowRate: null as number | null,
      mostProfitableTable: null as number | null,
      bestPromoter: null as number | null,
      averageClientRating: null as number | null,
    },
  };

  return (
    <AnalyticsPanels
      period={period}
      metrics={metrics}
      promoterRows={promoterRows}
      eventRows={eventRows}
      hasData={events.length > 0}
    />
  );
}
