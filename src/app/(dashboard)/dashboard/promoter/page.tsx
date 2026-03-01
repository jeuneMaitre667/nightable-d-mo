// Component: PromoterDashboardPage
// Reference: component.gallery/components/list
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: promoter guest-list management dashboard

import { addGuestAction } from "@/lib/promoter.actions";
import { createClient } from "@/lib/supabase/server";

import type { ReactElement } from "react";

type PromoterDashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

type PromoterEventRow = {
  id: string;
  title: string;
  date: string;
};

type GuestListRow = {
  id: string;
  guest_name: string;
  guest_phone: string | null;
  status: string;
  added_at: string;
  events: Array<{ title: string }> | null;
};

export default async function PromoterDashboardPage({ searchParams }: PromoterDashboardPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const promoterId = user?.id ?? "";

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date")
    .eq("status", "published")
    .order("date", { ascending: true })
    .limit(30);

  const { data: guestList } = await supabase
    .from("guest_lists")
    .select("id, guest_name, guest_phone, status, added_at, events(title)")
    .eq("promoter_id", promoterId)
    .order("added_at", { ascending: false })
    .limit(20);

  const eventList: PromoterEventRow[] = (events ?? []) as PromoterEventRow[];
  const guestListRows: GuestListRow[] = (guestList ?? []) as GuestListRow[];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="nt-heading text-3xl text-[#F7F6F3]">Dashboard Promoteur</h1>
        <p className="mt-1 text-sm text-[#888888]">Phase 1 — guest list digitale.</p>
        {params.error ? (
          <p className="mt-4 rounded border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#F7F6F3]">{params.error}</p>
        ) : null}
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="text-lg font-medium text-[#F7F6F3]">Ajouter un invité</h2>
        <form action={addGuestAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <select name="event_id" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]">
            <option value="">Sélectionner un événement</option>
            {eventList.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} — {event.date}
              </option>
            ))}
          </select>
          <input name="guest_name" placeholder="Nom invité" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <input name="guest_phone" placeholder="Téléphone (optionnel)" className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <button type="submit" className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] md:col-span-3 md:w-fit">Ajouter à la guest list</button>
        </form>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="mb-3 text-lg font-medium text-[#F7F6F3]">Mes invités récents</h2>
        <ul className="space-y-2 text-sm text-[#888888]">
          {guestListRows.map((guest) => (
            <li key={guest.id} className="rounded bg-[#0A0F2E] px-3 py-2">
              <p className="font-medium text-[#F7F6F3]">{guest.guest_name}</p>
              <p>
                {guest.events?.[0]?.title ?? "Événement"} • {guest.status}
                {guest.guest_phone ? ` • ${guest.guest_phone}` : ""}
              </p>
            </li>
          ))}
          {guestListRows.length === 0 ? <li className="text-[#888888]">Aucun invité ajouté pour le moment.</li> : null}
        </ul>
      </section>
    </div>
  );
}
