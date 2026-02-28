import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=Code+auth+manquant", origin));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=Echec+de+verification", origin));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = normalizeRole(profile?.role);
  return NextResponse.redirect(new URL(getDashboardPathByRole(role), origin));
}
