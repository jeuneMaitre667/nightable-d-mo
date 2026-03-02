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
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#888888]">Gestion</p>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-semibold leading-[1.3] text-[#F7F6F3]">Événements</h1>
            <span className="rounded-full border border-[#C9973A]/30 bg-[#C9973A]/12 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#C9973A]">
              Live
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[#888888]">{eventList.length} soirées · pilotage opérationnel en temps réel</p>
        </div>

        <CreateEventButton />
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
          <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Soirées publiées</p>
          <p className="mt-2 nt-heading text-[30px] leading-none text-[#C9973A] md:text-[32px]">{publishedCount}</p>
        </article>
        <article className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
          <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Tables disponibles</p>
          <p className="mt-2 nt-heading text-[30px] leading-none text-[#C9973A] md:text-[32px]">{totalAvailableTables}</p>
        </article>
        <article className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
          <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">Capacité publiée</p>
          <p className="mt-2 nt-heading text-[30px] leading-none text-[#C9973A] md:text-[32px]">{totalTables}</p>
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
