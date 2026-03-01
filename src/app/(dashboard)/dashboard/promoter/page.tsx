// Component: PromoterDashboardPage
// Reference: component.gallery/components/list
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: promoter guest-list management dashboard

import { redirect } from "next/navigation";
import { addGuestAction } from "@/lib/promoter.actions";
import { createClient } from "@/lib/supabase/server";
import PromoterShareActions from "./promoterShareActions";

import type { ReactElement } from "react";

type PromoterDashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

type PromoterEventRow = {
  id: string;
  title: string;
  date: string;
};

type PromoterProfileRow = {
  promo_code: string | null;
  total_paid: number | null;
};

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

type PromoterClickRow = {
  id: string;
  converted: boolean;
};

type GuestListRow = {
  id: string;
  guest_name: string;
  guest_phone: string | null;
  status: string;
  added_at: string;
  events: Array<{ title: string }> | null;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function statusBadgeClass(status: CommissionRow["status"]): string {
  if (status === "paid") {
    return "border border-[#3A9C6B]/40 bg-[#3A9C6B]/18 text-[#9be0bf]";
  }

  if (status === "validated") {
    return "border border-[#C9973A]/40 bg-[#C9973A]/18 text-[#F0D89A]";
  }

  return "border border-[#888888]/35 bg-[#888888]/15 text-[#c9c9c9]";
}

export default async function PromoterDashboardPage({ searchParams }: PromoterDashboardPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const promoterId = user.id;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartIso = monthStart.toISOString();

  const [
    eventsResult,
    guestListResult,
    profileResult,
    monthlyCommissionsResult,
    pendingCommissionsResult,
    reservationsCountResult,
    clicksResult,
    commissionsHistoryResult,
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, date")
      .eq("status", "published")
      .order("date", { ascending: true })
      .limit(30),
    supabase
      .from("guest_lists")
      .select("id, guest_name, guest_phone, status, added_at, events(title)")
      .eq("promoter_id", promoterId)
      .order("added_at", { ascending: false })
      .limit(20),
    supabase
      .from("promoter_profiles")
      .select("promo_code, total_paid")
      .eq("id", promoterId)
      .maybeSingle(),
    supabase
      .from("commissions")
      .select("id, amount, status, created_at")
      .eq("promoter_id", promoterId)
      .in("status", ["pending", "validated", "paid"])
      .gte("created_at", monthStartIso),
    supabase
      .from("commissions")
      .select("id, amount")
      .eq("promoter_id", promoterId)
      .eq("status", "pending"),
    supabase
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("promoter_id", promoterId)
      .eq("status", "confirmed")
      .gte("created_at", monthStartIso),
    supabase
      .from("promoter_clicks")
      .select("id, converted")
      .eq("promoter_id", promoterId),
    supabase
      .from("commissions")
      .select("id, created_at, amount, rate, status, reservation_id, club_id")
      .eq("promoter_id", promoterId)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  const eventList: PromoterEventRow[] = (eventsResult.data ?? []) as PromoterEventRow[];
  const guestListRows: GuestListRow[] = (guestListResult.data ?? []) as GuestListRow[];
  const promoterProfile = (profileResult.data ?? null) as PromoterProfileRow | null;
  const monthlyCommissions = (monthlyCommissionsResult.data ?? []) as Array<{ id: string; amount: number; status: string; created_at: string }>;
  const pendingCommissions = (pendingCommissionsResult.data ?? []) as Array<{ id: string; amount: number }>;
  const clicks = (clicksResult.data ?? []) as PromoterClickRow[];
  const commissionsHistory = (commissionsHistoryResult.data ?? []) as CommissionRow[];

  const reservationIds = Array.from(new Set(commissionsHistory.map((item) => item.reservation_id)));
  const clubIds = Array.from(new Set(commissionsHistory.map((item) => item.club_id)));

  const reservationsResult = reservationIds.length
    ? await supabase
      .from("reservations")
      .select("id, prepayment_amount, event_id")
      .in("id", reservationIds)
    : { data: [], error: null };

  const reservations = (reservationsResult.data ?? []) as ReservationSummaryRow[];
  const eventIds = Array.from(new Set(reservations.map((item) => item.event_id)));

  const eventsSummaryResult = eventIds.length
    ? await supabase
      .from("events")
      .select("id, title, date")
      .in("id", eventIds)
    : { data: [], error: null };

  const clubsResult = clubIds.length
    ? await supabase
      .from("club_profiles")
      .select("id, club_name")
      .in("id", clubIds)
    : { data: [], error: null };

  const reservationsById = new Map<string, ReservationSummaryRow>(
    reservations.map((item) => [item.id, item])
  );
  const eventsById = new Map<string, EventSummaryRow>(
    ((eventsSummaryResult.data ?? []) as EventSummaryRow[]).map((item) => [item.id, item])
  );
  const clubsById = new Map<string, ClubSummaryRow>(
    ((clubsResult.data ?? []) as ClubSummaryRow[]).map((item) => [item.id, item])
  );

  const monthlyRevenue = monthlyCommissions.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  const clientsCount = reservationsCountResult.count ?? 0;
  const pendingAmount = pendingCommissions.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  const totalPaid = Number(promoterProfile?.total_paid ?? 0);

  const totalClicks = clicks.length;
  const convertedClicks = clicks.filter((click) => click.converted).length;
  const conversionRate = totalClicks > 0 ? (convertedClicks / totalClicks) * 100 : 0;

  const promoCode = promoterProfile?.promo_code ?? null;
  const promoLink = promoCode ? `https://nighttable.fr/reserve?promo=${promoCode}` : null;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="nt-heading text-3xl text-[#F7F6F3]">Dashboard Promoteur</h1>
        <p className="mt-1 text-sm text-[#888888]">Suivi réel de tes commissions, conversions et invités.</p>
        {params.error ? (
          <p className="mt-4 rounded border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#F7F6F3]">{params.error}</p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">CA ce mois</p>
          <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{formatEuros(monthlyRevenue)}</p>
        </article>
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Clients amenés</p>
          <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{clientsCount}</p>
        </article>
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Commissions en attente</p>
          <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{formatEuros(pendingAmount)}</p>
        </article>
        <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Total versé</p>
          <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{formatEuros(totalPaid)}</p>
        </article>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="text-lg font-medium text-[#F7F6F3]">Mon lien de réservation</h2>
        {promoLink ? (
          <>
            <p className="mt-3 break-all rounded border border-[#C9973A]/25 bg-[#0A0F2E] px-3 py-2 text-sm text-[#F7F6F3]">
              {promoLink}
            </p>
            <div className="mt-3">
              <PromoterShareActions link={promoLink} />
            </div>
            <p className="mt-3 text-sm text-[#888888]">
              {totalClicks} clics total → {convertedClicks} réservations ({conversionRate.toFixed(1)}%)
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-[#888888]">Aucun promo code configuré pour ce compte.</p>
        )}
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="mb-3 text-lg font-medium text-[#F7F6F3]">Historique des commissions</h2>
        {commissionsHistory.length === 0 ? (
          <p className="text-sm text-[#888888]">Aucune commission enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#C9973A]/10 text-sm">
              <thead className="bg-[#0A0F2E] text-left text-xs uppercase tracking-wider text-[#888888]">
                <tr>
                  <th className="px-3 py-2">Date soirée</th>
                  <th className="px-3 py-2">Club</th>
                  <th className="px-3 py-2">Montant réservation</th>
                  <th className="px-3 py-2">Ma commission</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {commissionsHistory.map((commission) => {
                  const reservation = reservationsById.get(commission.reservation_id);
                  const event = reservation ? eventsById.get(reservation.event_id) : null;
                  const club = clubsById.get(commission.club_id);

                  return (
                    <tr key={commission.id} className="border-t border-[#C9973A]/8 bg-[#12172B]">
                      <td className="px-3 py-2 text-[#F7F6F3]">
                        {event?.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString("fr-FR") : "-"}
                      </td>
                      <td className="px-3 py-2 text-[#F7F6F3]">{club?.club_name ?? "Club"}</td>
                      <td className="px-3 py-2 text-[#F7F6F3]">{formatEuros(Number(reservation?.prepayment_amount ?? 0))}</td>
                      <td className="px-3 py-2 text-[#C9973A]">{formatEuros(Number(commission.amount ?? 0))}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs uppercase tracking-wider ${statusBadgeClass(commission.status)}`}>
                          {commission.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="text-lg font-medium text-[#F7F6F3]">Ajouter un invité</h2>
        <form action={addGuestAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <select name="event_id" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]">
            <option value="">Sélectionner un événement</option>
            {eventList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} — {event.date}
              </option>
            ))}
          </select>
          <input name="guest_name" placeholder="Nom invité" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <input name="guest_phone" placeholder="Téléphone (optionnel)" className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <button type="submit" className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] md:col-span-3 md:w-fit">Ajouter à la guest list</button>
        </form>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="mb-3 text-lg font-medium text-[#F7F6F3]">Mes invités récents</h2>
        <ul className="space-y-2 text-sm text-[#888888]">
          {guestListRows.map((guest) => (
            <li key={guest.id} className="rounded bg-[#0A0F2E] px-3 py-2">
              <p className="font-medium text-[#F7F6F3]">{guest.guest_name}</p>
              <p>
                {guest.events?.[0]?.title ?? "Événement"} • {guest.status}
                {guest.guest_phone ? ` • ${guest.guest_phone}` : ""}
              </p>
            </li>
          ))}
          {guestListRows.length === 0 ? <li className="text-[#888888]">Aucun invité ajouté pour le moment.</li> : null}
        </ul>
      </section>
    </div>
  );
}
