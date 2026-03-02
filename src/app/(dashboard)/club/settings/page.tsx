import { redirect } from "next/navigation";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ClubSettingsPanel from "./ClubSettingsPanel";

import type { ReactElement } from "react";

type ClubProfileRow = {
  id: string;
  club_name: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  instagram_handle: string | null;
  logo_url: string | null;
  cover_url: string | null;
  subscription_tier: string;
  subscription_active: boolean;
};

export default async function ClubSettingsPage(): Promise<ReactElement> {
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

  let clubId = user.id;
  if (role === "admin") {
    const { data: firstClub } = await supabase
      .from("club_profiles")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstClub?.id) {
      clubId = firstClub.id;
    }
  }

  const { data: clubProfile } = await supabase
    .from("club_profiles")
    .select("id,club_name,description,address,city,phone,website,instagram_handle,logo_url,cover_url,subscription_tier,subscription_active")
    .eq("id", clubId)
    .maybeSingle();

  const club = (clubProfile ?? null) as ClubProfileRow | null;

  return (
    <ClubSettingsPanel
      initialData={{
        clubId,
        clubName: club?.club_name ?? "",
        description: club?.description ?? "",
        address: club?.address ?? "",
        city: club?.city ?? "Paris",
        phone: club?.phone ?? "",
        website: club?.website ?? "",
        instagramHandle: club?.instagram_handle ?? "",
        logoUrl: club?.logo_url ?? "",
        coverUrl: club?.cover_url ?? "",
        subscriptionTier: club?.subscription_tier ?? "starter",
        subscriptionActive: club?.subscription_active ?? false,
      }}
    />
  );
}
