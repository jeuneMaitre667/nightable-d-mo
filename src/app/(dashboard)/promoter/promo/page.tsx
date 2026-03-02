// Component: PromoterPromoPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris card + metric pattern
// NightTable usage: dedicated promo link management page for promoter

import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PromoterPromoPanel } from "./PromoterPromoPanel";

type PromoterClickRow = {
  id: string;
  converted: boolean;
  created_at: string;
};

export default async function PromoterPromoPage(): Promise<ReactElement> {
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

  const [profileResult, clicksResult] = await Promise.all([
    supabase
      .from("promoter_profiles")
      .select("promo_code, commission_rate")
      .eq("id", promoterId)
      .maybeSingle(),
    supabase
      .from("promoter_clicks")
      .select("id, converted, created_at")
      .eq("promoter_id", promoterId)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const promoCode = (profileResult.data as { promo_code: string | null; commission_rate: number | null } | null)?.promo_code ?? null;
  const commissionRate = (profileResult.data as { promo_code: string | null; commission_rate: number | null } | null)?.commission_rate ?? 10;
  const promoLink = promoCode ? `https://nighttable.fr/reserve?promo=${promoCode}` : null;

  const clicks = (clicksResult.data ?? []) as PromoterClickRow[];
  const totalClicks = clicks.length;
  const convertedClicks = clicks.filter((c) => c.converted).length;
  const conversionRate = totalClicks > 0 ? (convertedClicks / totalClicks) * 100 : 0;

  // Last 7 days clicks breakdown
  const now = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const clicksByDay = new Map<string, { total: number; converted: number }>();
  for (const day of last7) {
    clicksByDay.set(day, { total: 0, converted: 0 });
  }
  for (const click of clicks) {
    const day = click.created_at.slice(0, 10);
    const entry = clicksByDay.get(day);
    if (entry) {
      entry.total += 1;
      if (click.converted) entry.converted += 1;
    }
  }

  const dayRows = last7.map((day) => {
    const entry = clicksByDay.get(day) ?? { total: 0, converted: 0 };

    return {
      day,
      dayLabel: new Date(`${day}T12:00:00`).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
      }),
      total: entry.total,
      converted: entry.converted,
    };
  });

  return (
    <PromoterPromoPanel
      promoLink={promoLink}
      promoCode={promoCode}
      commissionRate={commissionRate}
      totalClicks={totalClicks}
      convertedClicks={convertedClicks}
      conversionRate={conversionRate}
      days={dayRows}
    />
  );
}
