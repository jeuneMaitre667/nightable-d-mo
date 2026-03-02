// Component: ClubEventsPage
// Reference: component.gallery/components/list
// Inspired by: Linear.app dense list pattern
// NightTable usage: club event listing and status overview

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";
import { CreateEventButton } from "./CreateEventButton";
import { EventListTable } from "./EventListTable";

import type { ReactElement } from "react";

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string | null;
  dj_lineup: string[] | null;
  status: "draft" | "published" | "cancelled" | "completed";
  event_tables: Array<{ status: string }> | null;
};

function toFrenchDate(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function toHour(value: string): string {
  return value.slice(0, 5);
}

export default async function ClubEventsPage(): Promise<ReactElement> {
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

  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,date,start_time,end_time,dj_lineup,status,event_tables(status)")
    .eq("club_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error("Impossible de charger les événements du club.");
  }

  const eventList: EventRow[] = (events ?? []) as EventRow[];
  const publishedCount = eventList.filter((eventItem) => eventItem.status === "published").length;
  const totalAvailableTables = eventList.reduce(
    (sum, eventItem) =>
      sum + (eventItem.event_tables ?? []).filter((table) => table.status === "available").length,
    0
  );
  const totalTables = eventList.reduce((sum, eventItem) => sum + (eventItem.event_tables ?? []).length, 0);
  const rows = eventList.map((eventItem) => {
    const eventTables = eventItem.event_tables ?? [];
    const availableCount = eventTables.filter((table) => table.status === "available").length;
    const totalCount = eventTables.length;
    const djLineup = eventItem.dj_lineup ?? [];

    return {
      id: eventItem.id,
      title: eventItem.title,
      dateLabel: `${toFrenchDate(eventItem.date)} · ${toHour(eventItem.start_time)}${eventItem.end_time ? ` — ${toHour(eventItem.end_time)}` : ""}`,
      djLineup,
      availableCount,
      totalCount,
      status: eventItem.status,
    };
  });

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_65%,rgba(8,10,18,0.96)_100%)] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#888888] md:text-[11px]">Gestion</p>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-[1.3] text-[#F7F6F3] md:text-xl">Événements</h1>
              <span className="rounded-full border border-[#C9973A]/30 bg-[#C9973A]/12 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#C9973A]">
                Live
              </span>
            </div>
            <p className="mt-2 text-sm text-[#9A9AA0]">{eventList.length} soirées · pilotage opérationnel en temps réel</p>
          </div>

          <div className="w-full md:w-auto">
            <CreateEventButton />
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Soirées publiées</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{publishedCount}</p>
            <span className="text-[11px] text-[#3A9C6B]">actives</span>
          </div>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Tables disponibles</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{totalAvailableTables}</p>
            <span className="text-[11px] text-[#C9973A]">ce soir</span>
          </div>
        </article>
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-[0.06em] text-[#888888] md:text-[11px]">Capacité publiée</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="nt-heading text-2xl leading-none text-[#F7F6F3] md:text-4xl">{totalTables}</p>
            <span className="text-[11px] text-[#888888]">tables</span>
          </div>
        </article>
      </section>

      {eventList.length === 0 ? (
        <section className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10 text-[#C9973A]/70">
            ✦
          </div>
          <h2 className="nt-heading mt-4 text-[30px] text-[#F7F6F3]">Aucun événement pour le moment</h2>
          <p className="mx-auto mt-2 max-w-xl text-[14px] text-[#888888]">
            Démarre la prochaine soirée NightTable en créant un premier événement publié.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/club/events/new"
              className="inline-flex min-h-11 items-center rounded-[8px] border border-[#C9973A]/40 bg-[#C9973A]/12 px-5 py-2 text-[13px] font-medium text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Créer mon premier événement
            </Link>
          </div>
        </section>
      ) : (
        <EventListTable events={rows} />
      )}
    </div>
  );
}
