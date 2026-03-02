import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import {
  createVipInvitationAction,
  toggleVipPromoForEventAction,
  validateVipProfileAction,
} from "@/lib/vip.actions";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import ClubVipPanels from "./ClubVipPanels";

type FemaleVipRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  instagram_handle: string | null;
  avatar_url: string | null;
  validation_status: "pending" | "validated" | "rejected";
  validated_at?: string | null;
  validated_clubs: string[];
};

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  is_vip_promo_active: boolean;
};

type ReservationRow = {
  id: string;
  event_id: string;
  status: string;
  client_first_name: string | null;
  client_last_name: string | null;
};

type EventTableRow = {
  event_id: string;
  table_id: string;
  status: string;
};

type TableRow = {
  id: string;
  name: string;
  zone: string | null;
  capacity: number;
  is_promo: boolean;
};

async function validateVipFromForm(formData: FormData): Promise<void> {
  "use server";

  const vipId = String(formData.get("vip_id") ?? "").trim();
  const statusValue = String(formData.get("status") ?? "").trim();

  if (statusValue !== "validated" && statusValue !== "rejected") {
    return;
  }

  await validateVipProfileAction(vipId, statusValue);
}

async function createInvitationFromForm(formData: FormData): Promise<void> {
  "use server";

  const vipId = String(formData.get("vip_id") ?? "").trim();
  const selectedEventId = String(formData.get("event_id") ?? "").trim();
  const reservationId = String(formData.get("reservation_id") ?? "").trim();

  if (!vipId || !reservationId || !selectedEventId) {
    return;
  }

  await createVipInvitationAction(vipId, reservationId);
}

async function toggleVipPromoFromForm(formData: FormData): Promise<void> {
  "use server";

  const eventId = String(formData.get("event_id") ?? "").trim();
  const enabled = String(formData.get("enabled") ?? "false") === "true";

  await toggleVipPromoForEventAction(eventId, enabled);
}

export default async function ClubVipPage(): Promise<ReactElement> {
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
    redirect(getDashboardPathByRole(role));
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
    .select("subscription_tier, club_name")
    .eq("id", clubId)
    .maybeSingle();

  if (clubProfile?.subscription_tier !== "pro" && clubProfile?.subscription_tier !== "premium") {
    return (
      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#888888]">Femmes VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Module réservé Pro/Premium</h1>
        <p className="mt-2 text-sm text-[#888888]">
          Activez un abonnement Pro ou Premium pour gérer les validations et invitations VIP.
        </p>
      </section>
    );
  }

  const { data: pendingProfiles } = await supabase
    .from("female_vip_profiles")
    .select("id, first_name, last_name, instagram_handle, avatar_url, validation_status, validated_clubs")
    .eq("validation_status", "pending")
    .order("created_at", { ascending: false })
    .limit(24);

  const { data: validatedProfiles } = await supabase
    .from("female_vip_profiles")
    .select("id, first_name, last_name, instagram_handle, avatar_url, validation_status, validated_clubs, validated_at")
    .contains("validated_clubs", [clubId])
    .order("validated_at", { ascending: false });

  const today = new Date().toISOString().slice(0, 10);
  const { data: todayEvents } = await supabase
    .from("events")
    .select("id, title, date, start_time, is_vip_promo_active")
    .eq("club_id", clubId)
    .eq("date", today)
    .order("start_time", { ascending: true });

  const todayEventList = (todayEvents ?? []) as EventRow[];

  const { data: inviteEvents } = await supabase
    .from("events")
    .select("id, title, date, start_time, is_vip_promo_active")
    .eq("club_id", clubId)
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(12);

  const inviteEventList = (inviteEvents ?? []) as EventRow[];
  const inviteEventIds = inviteEventList.map((eventItem) => eventItem.id);
  const { data: reservations } = inviteEventIds.length
    ? await supabase
        .from("reservations")
        .select("id, event_id, status, client_first_name, client_last_name")
        .in("event_id", inviteEventIds)
        .in("status", ["confirmed", "reserved", "checked_in"])
        .order("created_at", { ascending: false })
        .limit(60)
    : { data: [] as ReservationRow[] };

  const { data: promoTables } = await supabase
    .from("tables")
    .select("id, name, zone, capacity, is_promo")
    .eq("club_id", clubId)
    .eq("is_promo", true)
    .order("name", { ascending: true });

  const todayEventIds = todayEventList.map((eventItem) => eventItem.id);
  const { data: eventTables } = todayEventIds.length
    ? await supabase
        .from("event_tables")
        .select("event_id, table_id, status")
        .in("event_id", todayEventIds)
    : { data: [] as EventTableRow[] };

  const inviteEventById = new Map(inviteEventList.map((item) => [item.id, item]));
  const reservationList = (reservations ?? []) as ReservationRow[];

  const eventTableList = (eventTables ?? []) as EventTableRow[];
  const tableList = (promoTables ?? []) as TableRow[];

  const pendingRows = ((pendingProfiles ?? []) as FemaleVipRow[]).map((vip) => ({
    id: vip.id,
    firstName: vip.first_name ?? "",
    lastName: vip.last_name ?? "",
    instagramHandle: vip.instagram_handle,
    avatarUrl: vip.avatar_url,
  }));

  const validatedRows = ((validatedProfiles ?? []) as FemaleVipRow[]).map((vip) => ({
    id: vip.id,
    firstName: vip.first_name ?? "",
    lastName: vip.last_name ?? "",
    instagramHandle: vip.instagram_handle,
    avatarUrl: vip.avatar_url,
    validatedAt: vip.validated_at ?? null,
  }));

  const inviteEventsRows = inviteEventList.map((eventItem) => ({
    id: eventItem.id,
    title: eventItem.title,
    dateLabel: `${new Date(eventItem.date).toLocaleDateString("fr-FR")} · ${eventItem.start_time.slice(0, 5)}`,
  }));

  const reservationRows = reservationList.map((reservation) => {
    const event = inviteEventById.get(reservation.event_id);
    const clientName = `${reservation.client_first_name ?? "Client"} ${reservation.client_last_name ?? ""}`.trim();

    return {
      id: reservation.id,
      eventId: reservation.event_id,
      label: `${event?.title ?? "Événement"} · ${clientName} · ${reservation.status}`,
    };
  });

  const promoEventsRows = todayEventList.map((eventItem) => ({
    id: eventItem.id,
    title: eventItem.title,
    dateLabel: `${new Date(eventItem.date).toLocaleDateString("fr-FR")} · ${eventItem.start_time.slice(0, 5)}`,
    isPromoActive: eventItem.is_vip_promo_active,
  }));

  const promoTablesByEvent: Record<string, Array<{ id: string; name: string; zone: string; capacity: number; status: string }>> = {};
  for (const eventItem of todayEventList) {
    promoTablesByEvent[eventItem.id] = tableList
      .filter((tableItem) => tableItem.is_promo)
      .map((tableItem) => {
        const eventTable = eventTableList.find(
          (item) => item.event_id === eventItem.id && item.table_id === tableItem.id
        );

        return {
          id: tableItem.id,
          name: tableItem.name,
          zone: tableItem.zone ?? "Zone",
          capacity: tableItem.capacity,
          status: eventTable?.status ?? "available",
        };
      });
  }

  return (
    <section className="space-y-8">
      <header className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#888888]">Femmes VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">{clubProfile?.club_name ?? "Club"} · Module VIP</h1>
        <p className="mt-2 text-sm text-[#888888]">
          Gérez la validation des profils, les invitations et l’activation des tables promos de la soirée.
        </p>
      </header>

      <ClubVipPanels
        pendingProfiles={pendingRows}
        validatedProfiles={validatedRows}
        inviteEvents={inviteEventsRows}
        reservationOptions={reservationRows}
        promoEvents={promoEventsRows}
        promoTablesByEvent={promoTablesByEvent}
        validateVipFromForm={validateVipFromForm}
        createInvitationFromForm={createInvitationFromForm}
        toggleVipPromoFromForm={toggleVipPromoFromForm}
      />
    </section>
  );
}
