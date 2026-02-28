"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

export async function addGuestAction(formData: FormData) {
  const eventId = String(formData.get("event_id") ?? "").trim();
  const guestName = String(formData.get("guest_name") ?? "").trim();
  const guestPhone = String(formData.get("guest_phone") ?? "").trim();

  if (!eventId || !guestName) {
    redirect("/dashboard/promoter?error=Event+et+nom+requis");
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
  if (role !== "promoter" && role !== "admin") {
    redirect("/dashboard?error=Acces+interdit");
  }

  const { error } = await supabase.from("guest_lists").insert({
    event_id: eventId,
    promoter_id: user.id,
    guest_name: guestName,
    guest_phone: guestPhone || null,
    status: "pending",
  });

  if (error) {
    redirect(`/dashboard/promoter?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard/promoter");
}
