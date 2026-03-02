// Component: PromoterCommissionsPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon Design System data table pattern
// NightTable usage: dedicated commissions history for promoter dashboard

import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PromoterCommissionsPanel } from "./PromoterCommissionsPanel";

type CommissionRow = {
  id: string;
  created_at: string;
  amount: number;
  rate: number;
  status: "pending" | "validated" | "paid";
  reservation_id: string;
  club_id: string;
};

type ReservationSummaryRow = {
  id: string;
  prepayment_amount: number;
  event_id: string;
};

type EventSummaryRow = {
  id: string;
  title: string;
  date: string;
};

type ClubSummaryRow = {
  id: string;
  club_name: string | null;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function statusLabel(status: CommissionRow["status"]): string {
  if (status === "paid") return "Versée";
  if (status === "validated") return "Validée";
  return "En attente";
}

export default async function PromoterCommissionsPage(): Promise<ReactElement> {
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
  if (role !== "promoter" && role !== "admin") {
    redirect(getDashboardPathByRole(role));
  }

  const promoterId = user.id;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartIso = monthStart.toISOString();

  const [allCommissionsResult, monthlyResult, pendingResult, profileResult] =
    await Promise.all([
      supabase
        .from("commissions")
        .select("id, created_at, amount, rate, status, reservation_id, club_id")
        .eq("promoter_id", promoterId)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("commissions")
        .select("id, amount")
        .eq("promoter_id", promoterId)
        .in("status", ["pending", "validated", "paid"])
        .gte("created_at", monthStartIso),
      supabase
        .from("commissions")
        .select("id, amount")
        .eq("promoter_id", promoterId)
        .eq("status", "pending"),
      supabase
        .from("promoter_profiles")
        .select("total_paid")
        .eq("id", promoterId)
        .maybeSingle(),
    ]);

  const commissions = (allCommissionsResult.data ?? []) as CommissionRow[];
  const monthlyRows = (monthlyResult.data ?? []) as Array<{ id: string; amount: number }>;
  const pendingRows = (pendingResult.data ?? []) as Array<{ id: string; amount: number }>;

  const monthlyRevenue = monthlyRows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const pendingAmount = pendingRows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const totalPaid = Number((profileResult.data as { total_paid: number | null } | null)?.total_paid ?? 0);

  // Resolve reservation → event → club names
  const reservationIds = Array.from(new Set(commissions.map((c) => c.reservation_id)));
  const clubIds = Array.from(new Set(commissions.map((c) => c.club_id)));

  const reservationsResult = reservationIds.length
    ? await supabase.from("reservations").select("id, prepayment_amount, event_id").in("id", reservationIds)
    : { data: [] };

  const reservations = (reservationsResult.data ?? []) as ReservationSummaryRow[];
  const eventIds = Array.from(new Set(reservations.map((r) => r.event_id)));

  const [eventsResult, clubsResult] = await Promise.all([
    eventIds.length
      ? supabase.from("events").select("id, title, date").in("id", eventIds)
      : Promise.resolve({ data: [] }),
    clubIds.length
      ? supabase.from("club_profiles").select("id, club_name").in("id", clubIds)
      : Promise.resolve({ data: [] }),
  ]);

  const reservationsById = new Map(
    reservations.map((r) => [r.id, r])
  );
  const eventsById = new Map(
    ((eventsResult.data ?? []) as EventSummaryRow[]).map((e) => [e.id, e])
  );
  const clubsById = new Map(
    ((clubsResult.data ?? []) as ClubSummaryRow[]).map((c) => [c.id, c])
  );

  const commissionRows = commissions.map((commission) => {
    const reservation = reservationsById.get(commission.reservation_id);
    const event = reservation ? eventsById.get(reservation.event_id) : null;
    const club = clubsById.get(commission.club_id);

    return {
      id: commission.id,
      createdAtLabel: new Date(commission.created_at).toLocaleDateString("fr-FR"),
      clubName: club?.club_name ?? "—",
      eventTitle: event?.title ?? "—",
      reservationAmountLabel: formatEuros(Number(reservation?.prepayment_amount ?? 0)),
      rateLabel: `${commission.rate}%`,
      commissionAmountLabel: formatEuros(Number(commission.amount ?? 0)),
      status: commission.status,
      statusLabel: statusLabel(commission.status),
    };
  });

  return (
    <PromoterCommissionsPanel
      monthlyRevenueLabel={formatEuros(monthlyRevenue)}
      pendingAmountLabel={formatEuros(pendingAmount)}
      totalPaidLabel={formatEuros(totalPaid)}
      commissions={commissionRows}
    />
  );
}
