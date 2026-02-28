"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";

async function ensureRoleProfile(userId: string, role: string) {
  const supabase = await createClient();

  switch (role) {
    case "client":
      await supabase.from("client_profiles").upsert({ id: userId }, { onConflict: "id" });
      break;
    case "club":
      await supabase.from("club_profiles").upsert({ id: userId }, { onConflict: "id" });
      break;
    case "promoter":
      await supabase.from("promoter_profiles").upsert({ id: userId }, { onConflict: "id" });
      break;
    case "female_vip":
      await supabase.from("female_vip_profiles").upsert({ id: userId }, { onConflict: "id" });
      break;
    default:
      break;
  }
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const role = normalizeRole(String(formData.get("role") ?? "client"));

  if (!email || !password) {
    redirect("/register?error=Email+et+mot+de+passe+requis");
  }

  if (password.length < 8) {
    redirect("/register?error=Mot+de+passe+minimum+8+caracteres");
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/api/auth/callback`,
      data: { role },
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user?.id) {
    await ensureRoleProfile(data.user.id, role);
  }

  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect("/login?error=Identifiants+requis");
  }

  const supabase = await createClient();

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !signInData.user) {
    redirect("/login?error=Identifiants+invalides");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", signInData.user.id)
    .single();

  const role = normalizeRole(profile?.role);
  const dashboardPath = getDashboardPathByRole(role);
  redirect(dashboardPath);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
