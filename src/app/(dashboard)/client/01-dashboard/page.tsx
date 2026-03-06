// Component: ClientDashboardHomePage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris dashboard summary pattern
// NightTable usage: Client dashboard home

import { redirect } from "next/navigation";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ClientDashboardPanels } from "../ClientDashboardPanels";

type ClientProfileRow = {
  first_name: string | null;
  nighttable_score: number;
};

type ReservationRow = {
  id: string;
  event_id: string;
  event_table_id: string;
  status: string;
  event_starts_at: string;
  prepayment_amount: number;
};

type EventRow = {
  id: string;
  title: string;
  club_id: string;
};

type ClubRow = {
  club_name: string;
};

type EventTableRow = {
  table: { name: string } | { name: string }[] | null;
};

function scoreTone(score: number): string {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export default async function ClientDashboardHomePage() {
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
  // ...rest of code unchanged
}