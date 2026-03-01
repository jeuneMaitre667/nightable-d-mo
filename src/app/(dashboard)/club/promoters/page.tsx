// Component: ClubPromotersPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table pattern
// NightTable usage: Club promoter management dashboard

import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { validateCommissionAction } from "@/lib/promoter.actions";
import { createClient } from "@/lib/supabase/server";

import { AddPromoterModal } from "./AddPromoterModal";

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
  status: "pending" | "validated" | "paid";
  created_at: string;
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
        .select("id, promoter_id, amount, status, created_at")
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

  const topFivePromoters = sortedPromoters.slice(0, 5);

  const pendingCommissions = commissions
    .filter((row) => row.status === "pending")
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );

  const promoterNameById = new Map(
    promoters.map((promoter) => [
      promoter.id,
      `${promoter.first_name ?? ""} ${promoter.last_name ?? ""}`.trim() || "Promoteur",
    ])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#F7F6F3]">Promoteurs</h1>
          <p className="text-sm text-[#888888]">
            Suivez les performances, créez de nouveaux comptes et validez les commissions en attente.
          </p>
        </div>
        <AddPromoterModal />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#C9973A]/10">
        <table className="w-full">
          <thead className="bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]">
            <tr>
              <th className="px-4 py-3 text-left">Rang</th>
              <th className="px-4 py-3 text-left">Promoteur</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Commission</th>
              <th className="px-4 py-3 text-left">CA du mois</th>
              <th className="px-4 py-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {sortedPromoters.length === 0 ? (
              <tr className="bg-[#12172B]">
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#888888]">
                  Aucun promoteur pour le moment.
                </td>
              </tr>
            ) : (
              sortedPromoters.map((promoter, index) => {
                const monthlyRevenue = monthlyRevenueByPromoter[promoter.id] ?? 0;

                return (
                  <tr
                    key={promoter.id}
                    className="border-t border-[#C9973A]/5 bg-[#12172B] text-sm text-[#F7F6F3]"
                  >
                    <td className="px-4 py-3 font-semibold text-[#C9973A]">{rankBadge(index)}</td>
                    <td className="px-4 py-3">
                      {`${promoter.first_name ?? ""} ${promoter.last_name ?? ""}`.trim() ||
                        "Promoteur"}
                    </td>
                    <td className="px-4 py-3 text-[#C9973A]">{promoter.promo_code}</td>
                    <td className="px-4 py-3">{promoter.commission_rate}%</td>
                    <td className="px-4 py-3">{monthlyRevenue.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                          promoter.is_active
                            ? "border border-[#3A9C6B]/30 bg-[#3A9C6B]/15 text-[#3A9C6B]"
                            : "border border-[#888888]/30 bg-[#888888]/15 text-[#888888]"
                        }`}
                      >
                        {promoter.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-5">
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Commissions en attente</h2>
          <div className="mt-4 space-y-3">
            {pendingCommissions.length === 0 ? (
              <p className="text-sm text-[#888888]">Aucune commission en attente de validation.</p>
            ) : (
              pendingCommissions.map((commission) => (
                <div
                  key={commission.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#C9973A]/10 bg-[#0A0F2E] p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#F7F6F3]">
                      {promoterNameById.get(commission.promoter_id) ?? "Promoteur"}
                    </p>
                    <p className="text-xs text-[#888888]">
                      {new Date(commission.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#C9973A]">
                      {Number(commission.amount).toFixed(2)} €
                    </span>
                    <form action={validateCommissionFormAction}>
                      <input type="hidden" name="commission_id" value={commission.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/40 px-3 py-2 text-xs font-semibold text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10"
                      >
                        Valider
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-5">
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Top 5 du mois</h2>
          <div className="mt-4 space-y-3">
            {topFivePromoters.length === 0 ? (
              <p className="text-sm text-[#888888]">Pas encore de données ce mois-ci.</p>
            ) : (
              topFivePromoters.map((promoter, index) => (
                <div
                  key={promoter.id}
                  className="flex items-center justify-between rounded-lg border border-[#C9973A]/10 bg-[#0A0F2E] px-3 py-2"
                >
                  <p className="text-sm text-[#F7F6F3]">
                    <span className="mr-2 text-[#C9973A]">{rankBadge(index)}</span>
                    {promoterNameById.get(promoter.id) ?? "Promoteur"}
                  </p>
                  <p className="text-sm font-semibold text-[#C9973A]">
                    {(monthlyRevenueByPromoter[promoter.id] ?? 0).toFixed(2)} €
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
