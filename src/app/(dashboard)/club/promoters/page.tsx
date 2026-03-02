// Component: ClubPromotersPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table pattern
// NightTable usage: Club promoter management dashboard

import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { validateCommissionAction } from "@/lib/promoter.actions";
import { createClient } from "@/lib/supabase/server";

import { AddPromoterModal } from "./AddPromoterModal";
import { PendingCommissionsTable } from "./PendingCommissionsTable";
import { PromotersTable } from "./PromotersTable";

type PromoterProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  promo_code: string;
  commission_rate: number;
  is_active: boolean;
};

type CommissionRow = {
  id: string;
  promoter_id: string;
  amount: number;
  rate: number | null;
  reservation_id: string | null;
  status: "pending" | "validated" | "paid";
  created_at: string;
};

type ReservationEventRow = {
  id: string;
  event_id: string;
};

type EventTitleRow = {
  id: string;
  title: string;
};

function rankBadge(index: number): string {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `#${index + 1}`;
}

async function validateCommissionFormAction(formData: FormData): Promise<void> {
  "use server";
  await validateCommissionAction(formData);
}

export default async function ClubPromotersPage() {
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
  const { data: rawPromoters } = await supabase
    .from("promoter_profiles")
    .select("id, first_name, last_name, promo_code, commission_rate, is_active")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  const promoters = (rawPromoters ?? []) as PromoterProfileRow[];
  const promoterIds = promoters.map((promoter) => promoter.id);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: rawCommissions } = promoterIds.length
    ? await supabase
        .from("commissions")
        .select("id, promoter_id, amount, rate, reservation_id, status, created_at")
        .eq("club_id", clubId)
        .in("promoter_id", promoterIds)
    : { data: [] as CommissionRow[] };

  const commissions = (rawCommissions ?? []) as CommissionRow[];
  const monthlyRevenueByPromoter = commissions.reduce<Record<string, number>>((accumulator, row) => {
    if (new Date(row.created_at) >= monthStart) {
      accumulator[row.promoter_id] = (accumulator[row.promoter_id] ?? 0) + Number(row.amount ?? 0);
    }

    return accumulator;
  }, {});

  const sortedPromoters = [...promoters].sort(
    (left, right) =>
      (monthlyRevenueByPromoter[right.id] ?? 0) - (monthlyRevenueByPromoter[left.id] ?? 0)
  );

  const pendingCommissions = commissions
    .filter((row) => row.status === "pending")
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );

  const reservationIds = Array.from(
    new Set(pendingCommissions.map((commission) => commission.reservation_id).filter(Boolean) as string[])
  );

  const { data: reservationEvents } = reservationIds.length
    ? await supabase
        .from("reservations")
        .select("id,event_id")
        .in("id", reservationIds)
    : { data: [] as ReservationEventRow[] };

  const reservationEventList = (reservationEvents ?? []) as ReservationEventRow[];
  const eventIds = Array.from(new Set(reservationEventList.map((row) => row.event_id)));

  const { data: eventTitles } = eventIds.length
    ? await supabase
        .from("events")
        .select("id,title")
        .in("id", eventIds)
    : { data: [] as EventTitleRow[] };

  const reservationById = new Map(reservationEventList.map((row) => [row.id, row]));
  const eventById = new Map(((eventTitles ?? []) as EventTitleRow[]).map((row) => [row.id, row.title]));

  const promoterNameById = new Map(
    promoters.map((promoter) => [
      promoter.id,
      `${promoter.first_name ?? ""} ${promoter.last_name ?? ""}`.trim() || "Promoteur",
    ])
  );
  const promoterRows = sortedPromoters.map((promoter, index) => ({
    id: promoter.id,
    rank: index + 1,
    rankLabel: rankBadge(index),
    fullName: promoterNameById.get(promoter.id) ?? "Promoteur",
    promoCode: promoter.promo_code,
    commissionRate: promoter.commission_rate,
    monthlyRevenue: monthlyRevenueByPromoter[promoter.id] ?? 0,
    isActive: promoter.is_active,
  }));

  const pendingRows = pendingCommissions.map((commission) => {
    const reservation = commission.reservation_id ? reservationById.get(commission.reservation_id) : null;
    const eventTitle = reservation ? eventById.get(reservation.event_id) ?? "Événement" : "Événement";

    return {
      id: commission.id,
      promoterName: promoterNameById.get(commission.promoter_id) ?? "Promoteur",
      eventTitle,
      amountLabel: `${Number(commission.amount).toFixed(2)} €`,
      rateLabel: `${Number(commission.rate ?? 0)}%`,
    };
  });

  const activePromoters = promoterRows.filter((row) => row.isActive).length;

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_65%,rgba(8,10,18,0.96)_100%)] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#888888] md:text-[11px]">Gestion</p>
            <h1 className="mt-1 text-lg font-semibold text-[#F7F6F3] md:text-xl">Promoteurs</h1>
            <p className="mt-2 text-sm text-[#9A9AA0]">
              Suivez les performances, créez de nouveaux comptes et validez les commissions en attente.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <AddPromoterModal />
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Promoteurs</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{promoterRows.length}</p>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Actifs</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{activePromoters}</p>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Commissions pending</p>
          <p className="mt-3 nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{pendingRows.length}</p>
        </article>
      </section>

      <PromotersTable rows={promoterRows} />

      <PendingCommissionsTable rows={pendingRows} validateCommissionFormAction={validateCommissionFormAction} />
    </div>
  );
}
