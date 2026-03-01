// Component: ClubDashboardPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: legacy dashboard namespace for club quick management

import { createClient } from "@/lib/supabase/server";
import { createEventAction, createTableAction } from "@/lib/club.actions";

import type { ReactElement } from "react";

type ClubDashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

type ClubEventListRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  status: string;
};

type ClubTableListRow = {
  id: string;
  name: string;
  capacity: number;
  base_price: number;
  zone: string | null;
};

export default async function ClubDashboardPage({ searchParams }: ClubDashboardPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const clubId = user?.id ?? "";

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date, start_time, status")
    .eq("club_id", clubId)
    .order("date", { ascending: true })
    .limit(10);

  const { data: tables } = await supabase
    .from("tables")
    .select("id, name, capacity, base_price, zone")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(10);

  const eventList: ClubEventListRow[] = (events ?? []) as ClubEventListRow[];
  const tableList: ClubTableListRow[] = (tables ?? []) as ClubTableListRow[];

  async function createEventFromForm(formData: FormData): Promise<void> {
    "use server";

    await createEventAction({
      title: String(formData.get("title") ?? "").trim(),
      date: String(formData.get("date") ?? "").trim(),
      startTime: String(formData.get("start_time") ?? "").trim(),
      endTime: undefined,
      djLineup: [],
      dressCode: undefined,
      description: String(formData.get("description") ?? "").trim() || undefined,
      coverUrl: undefined,
      isVipPromoActive: false,
      isAuction: false,
      notoriety: 1,
    });
  }

  async function createTableFromForm(formData: FormData): Promise<void> {
    "use server";

    const zoneValue = String(formData.get("zone") ?? "vip").trim().toLowerCase();
    const zone =
      zoneValue === "dancefloor" || zoneValue === "vip" || zoneValue === "loge" || zoneValue === "terrasse"
        ? zoneValue
        : "vip";

    await createTableAction({
      name: String(formData.get("name") ?? "").trim(),
      capacity: Number(formData.get("capacity") ?? 0),
      basePrice: Number(formData.get("base_price") ?? 0),
      zone,
      isPromo: false,
    });
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="nt-heading text-3xl text-[#F7F6F3]">Dashboard Club</h1>
        <p className="mt-1 text-sm text-[#888888]">Phase 1 — gestion événements et tables.</p>
        {params.error ? (
          <p className="mt-4 rounded border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#F7F6F3]">{params.error}</p>
        ) : null}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <form action={createEventFromForm} className="space-y-3 rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <h2 className="text-lg font-medium text-[#F7F6F3]">Créer un événement</h2>
          <input name="title" placeholder="Titre" required className="w-full rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <textarea name="description" placeholder="Description" className="w-full rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="date" type="date" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
            <input name="start_time" type="time" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          </div>
          <button type="submit" className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]">Ajouter événement</button>
        </form>

        <form action={createTableFromForm} className="space-y-3 rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <h2 className="text-lg font-medium text-[#F7F6F3]">Créer une table</h2>
          <input name="name" placeholder="Nom table" required className="w-full rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="capacity" type="number" min={1} defaultValue={4} required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
            <input name="base_price" type="number" min={1} step="0.01" required className="rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          </div>
          <input name="zone" placeholder="Zone (vip, loge, terrasse...)" className="w-full rounded border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3]" />
          <button type="submit" className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]">Ajouter table</button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <h2 className="mb-3 text-lg font-medium text-[#F7F6F3]">Événements récents</h2>
          <ul className="space-y-2 text-sm text-[#888888]">
            {eventList.map((event) => (
              <li key={event.id} className="rounded bg-[#0A0F2E] px-3 py-2">
                <p className="font-medium text-[#F7F6F3]">{event.title}</p>
                <p>{event.date} • {event.start_time} • {event.status}</p>
              </li>
            ))}
            {eventList.length === 0 ? <li className="text-[#888888]">Aucun événement pour le moment.</li> : null}
          </ul>
        </div>

        <div className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <h2 className="mb-3 text-lg font-medium text-[#F7F6F3]">Tables</h2>
          <ul className="space-y-2 text-sm text-[#888888]">
            {tableList.map((table) => (
              <li key={table.id} className="rounded bg-[#0A0F2E] px-3 py-2">
                <p className="font-medium text-[#F7F6F3]">{table.name}</p>
                <p>Capacité {table.capacity} • {table.base_price}€ {table.zone ? `• ${table.zone}` : ""}</p>
              </li>
            ))}
            {tableList.length === 0 ? <li className="text-[#888888]">Aucune table pour le moment.</li> : null}
          </ul>
        </div>
      </section>
    </div>
  );
}
