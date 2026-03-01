// Component: ClientWaitlistPage
// Reference: component.gallery/components/list
// Inspired by: Atlassian list row pattern
// NightTable usage: Client waitlist management

import Link from "next/link";
import { redirect } from "next/navigation";

import { normalizeRole } from "@/lib/auth";
import { leaveWaitlistAction } from "@/lib/reservation.actions";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Mes waitlists</h1>
        <p className="text-sm text-[#888888]">
          Consultez vos positions actives et quittez une file d’attente en un clic.
        </p>
      </div>

      {waitlistEntries.length === 0 ? (
        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Aucune waitlist active</h2>
          <p className="mt-2 text-sm text-[#888888]">
            Explorez les événements et rejoignez une waitlist pour augmenter vos chances.
          </p>
          <Link
            href="/clubs"
            className="mt-5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110"
          >
            Voir les événements
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {waitlistEntries.map((entry) => {
            const eventItem = eventById.get(entry.event_id);
            const clubName = eventItem ? clubById.get(eventItem.club_id) : "Club";

            return (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C9973A]/10 bg-[#12172B] p-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#F7F6F3]">
                    {eventItem?.title ?? "Événement"} — {clubName ?? "Club"}
                  </p>
                  <p className="text-sm text-[#888888]">
                    {eventItem
                      ? new Date(`${eventItem.date}T${eventItem.start_time}`).toLocaleString("fr-FR")
                      : "Date à confirmer"}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-[#C9973A]">
                    Position #{entry.position}
                  </p>
                </div>

                <form action={leaveWaitlistFormAction}>
                  <input type="hidden" name="waitlist_id" value={entry.id} />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C4567A]/40 px-3 py-2 text-xs font-semibold text-[#C4567A] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/10"
                  >
                    Quitter
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
