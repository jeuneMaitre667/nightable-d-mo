// Component: ClientDashboardHomePage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris dashboard summary pattern
// NightTable usage: Client dashboard home

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ClientDashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  // ...rest of code unchanged
}