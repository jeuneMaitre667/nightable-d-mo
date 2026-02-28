import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";

export default async function DashboardRootPage() {
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
    .single();

  const role = normalizeRole(profile?.role);
  redirect(getDashboardPathByRole(role));
}
