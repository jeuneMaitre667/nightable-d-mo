// Component: PromoterGuestlistPage
// Reference: component.gallery/components/list
// Inspired by: IBM Carbon dashboard list pattern
// NightTable usage: Promoter guest list management

import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { GuestListClient } from "./GuestListClient";

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
};

type GuestRow = {
  id: string;
  event_id: string;
  guest_name: string;
  guest_phone: string | null;
  status: "pending" | "arrived" | "no_show";
  added_at: string;
};

export default async function PromoterGuestlistPage() {
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
  if (role !== "promoter" && role !== "admin") {
    redirect("/dashboard");
  }

  let clubId: string | null = null;
  if (role === "promoter") {
    const { data: promoterProfile } = await supabase
      .from("promoter_profiles")
      .select("club_id")
      .eq("id", user.id)
      .maybeSingle();

    clubId = promoterProfile?.club_id ?? null;
  }

  const today = new Date().toISOString().slice(0, 10);
  let eventsQuery = supabase
    .from("events")
    .select("id, title, date, start_time")
    .gte("date", today)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(30);

  if (clubId) {
    eventsQuery = eventsQuery.eq("club_id", clubId);
  }

  const { data: rawEvents } = await eventsQuery;
  const events = (rawEvents ?? []) as EventRow[];
  const eventById = new Map(events.map((eventItem) => [eventItem.id, eventItem]));
  const eventIds = events.map((eventItem) => eventItem.id);

  const guestQuery = supabase
    .from("guest_lists")
    .select("id, event_id, guest_name, guest_phone, status, added_at")
    .order("added_at", { ascending: false });

  const filteredGuestQuery =
    role === "admin"
      ? eventIds.length > 0
        ? guestQuery.in("event_id", eventIds)
        : guestQuery.limit(0)
      : guestQuery.eq("promoter_id", user.id);

  const { data: rawGuests } = await filteredGuestQuery;
  const initialGuests = ((rawGuests ?? []) as GuestRow[])
    .filter((guest) => eventById.has(guest.event_id))
    .map((guest) => ({
      id: guest.id,
      eventId: guest.event_id,
      eventTitle: eventById.get(guest.event_id)?.title ?? "Événement",
      eventDate: eventById.get(guest.event_id)?.date ?? today,
      guestName: guest.guest_name,
      guestPhone: guest.guest_phone,
      status: guest.status,
      addedAt: guest.added_at,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Guest List</h1>
        <p className="text-sm text-[#888888]">
          Gérez vos invités par événement, suivez les arrivées en direct et ajoutez de nouveaux noms.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Aucun événement à venir</h2>
          <p className="mt-2 text-sm text-[#888888]">
            Dès qu’un événement est publié pour votre club, vous pourrez gérer votre guest list ici.
          </p>
          <a
            href="/dashboard/promoter"
            className="mt-5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110"
          >
            Retour au dashboard
          </a>
        </div>
      ) : (
        <GuestListClient
          events={events.map((eventItem) => ({
            id: eventItem.id,
            title: eventItem.title,
            date: eventItem.date,
            startTime: eventItem.start_time,
          }))}
          initialGuests={initialGuests}
          initialEventId={events[0]?.id ?? null}
        />
      )}
    </div>
  );
}
