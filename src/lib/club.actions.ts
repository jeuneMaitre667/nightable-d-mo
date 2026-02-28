"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

export async function createEventAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const startTime = String(formData.get("start_time") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !date || !startTime) {
    redirect("/dashboard/club?error=Champs+event+requis");
  }

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
  if (role !== "club" && role !== "admin") {
    redirect("/dashboard?error=Acces+interdit");
  }

  const { error } = await supabase.from("events").insert({
    club_id: user.id,
    title,
    date,
    start_time: startTime,
    description: description || null,
    status: "published",
  });

  if (error) {
    redirect(`/dashboard/club?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/club");
}

export async function createTableAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const capacity = Number(formData.get("capacity") ?? 4);
  const basePrice = Number(formData.get("base_price") ?? 0);
  const zone = String(formData.get("zone") ?? "").trim();

  if (!name || !Number.isFinite(capacity) || !Number.isFinite(basePrice) || basePrice <= 0) {
    redirect("/dashboard/club?error=Champs+table+invalides");
  }

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
  if (role !== "club" && role !== "admin") {
    redirect("/dashboard?error=Acces+interdit");
  }

  const { error } = await supabase.from("tables").insert({
    club_id: user.id,
    name,
    capacity,
    base_price: basePrice,
    zone: zone || null,
    is_active: true,
  });

  if (error) {
    redirect(`/dashboard/club?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/club");
}
