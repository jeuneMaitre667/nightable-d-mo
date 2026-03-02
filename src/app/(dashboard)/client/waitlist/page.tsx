// Component: ClientWaitlistPage
// Reference: component.gallery/components/list
// Inspired by: Atlassian list row pattern
// NightTable usage: Client waitlist management

import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { leaveWaitlistAction } from "@/lib/reservation.actions";
import { createClient } from "@/lib/supabase/server";
import { ClientWaitlistList } from "./ClientWaitlistList";

type WaitlistRow = {
  id: string;
  event_id: string;
  position: number;
  status: string;
  created_at: string;
};

type EventRow = {
  id: string;
  title: string;
  club_id: string;
  date: string;
  start_time: string;
};

type ClubRow = {
  id: string;
  club_name: string;
};

async function leaveWaitlistFormAction(formData: FormData): Promise<void> {
  "use server";
  await leaveWaitlistAction(formData);
}

export default async function ClientWaitlistPage() {
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
  if (role !== "client" && role !== "female_vip" && role !== "admin") {
    redirect("/dashboard");
  }

  const { data: rawWaitlist } = await supabase
    .from("waitlist")
    .select("id, event_id, position, status, created_at")
    .eq("client_id", user.id)
    .in("status", ["pending", "notified", "accepted"])
    .order("created_at", { ascending: false });

  const waitlistEntries = (rawWaitlist ?? []) as WaitlistRow[];
  const eventIds = Array.from(new Set(waitlistEntries.map((entry) => entry.event_id)));

  const { data: rawEvents } = eventIds.length
    ? await supabase
        .from("events")
        .select("id, title, club_id, date, start_time")
        .in("id", eventIds)
    : { data: [] as EventRow[] };

  const events = (rawEvents ?? []) as EventRow[];
  const clubIds = Array.from(new Set(events.map((eventItem) => eventItem.club_id)));

  const { data: rawClubs } = clubIds.length
    ? await supabase.from("club_profiles").select("id, club_name").in("id", clubIds)
    : { data: [] as ClubRow[] };

  const clubs = (rawClubs ?? []) as ClubRow[];
  const eventById = new Map(events.map((eventItem) => [eventItem.id, eventItem]));
  const clubById = new Map(clubs.map((club) => [club.id, club.club_name]));
  const waitlistRows = waitlistEntries.map((entry) => {
    const eventItem = eventById.get(entry.event_id);
    const clubName = eventItem ? clubById.get(eventItem.club_id) : "Club";

    return {
      id: entry.id,
      title: eventItem?.title ?? "Événement",
      clubName: clubName ?? "Club",
      dateLabel: eventItem
        ? new Date(`${eventItem.date}T${eventItem.start_time}`).toLocaleString("fr-FR")
        : "Date à confirmer",
      position: entry.position,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Mes waitlists</h1>
        <p className="text-sm text-[#888888]">
          Consultez vos positions actives et quittez une file d’attente en un clic.
        </p>
      </div>

      <ClientWaitlistList entries={waitlistRows} leaveWaitlistFormAction={leaveWaitlistFormAction} />
    </div>
  );
}
