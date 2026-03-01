import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole } from "@/lib/auth";

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string | null;
  dj_lineup: string[];
  status: "draft" | "published" | "cancelled" | "completed";
  event_tables: Array<{ status: string }>;
};

function statusUi(status: EventRow["status"]): { label: string; className: string } {
  if (status === "published") {
    return {
      label: "Publié",
      className: "border border-[#3A9C6B]/40 bg-[#3A9C6B]/20 text-[#a8e0c5]",
    };
  }

  if (status === "cancelled") {
    return {
      label: "Annulé",
      className: "border border-[#C4567A]/50 bg-[#C4567A]/15 text-[#f2c7d5]",
    };
  }

  if (status === "completed") {
    return {
      label: "Terminé",
      className: "border border-[#3A6BC9]/45 bg-[#3A6BC9]/15 text-[#bfd1f5]",
    };
  }

  return {
    label: "Brouillon",
    className: "border border-[#888888]/45 bg-[#888888]/15 text-[#c9c9c9]",
  };
}

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

export default async function ClubEventsPage(): Promise<JSX.Element> {
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
    .order("date", { ascending: false })
    .returns<EventRow[]>();

  if (error) {
    throw new Error("Impossible de charger les événements du club.");
  }

  const eventList = events ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Club Dashboard</p>
          <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3] md:text-4xl">Événements</h1>
          <p className="mt-2 text-sm text-[#888888]">
            Pilote tes soirées à venir et vérifie la disponibilité des tables en un coup d’œil.
          </p>
        </div>

        <Link href="/dashboard/club/events/new" className="nt-btn nt-btn-primary w-full px-5 py-3 text-center md:w-auto">
          Créer un événement
        </Link>
      </header>

      {eventList.length === 0 ? (
        <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-10 text-center">
          <h2 className="nt-heading text-3xl text-[#F7F6F3]">Aucun événement pour le moment</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#888888]">
            Démarre la prochaine soirée NightTable en créant un premier événement publié.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/club/events/new" className="nt-btn nt-btn-primary px-6 py-3">
              Créer mon premier événement
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {eventList.map((eventItem) => {
            const availableCount = eventItem.event_tables.filter((table) => table.status === "available").length;
            const totalCount = eventItem.event_tables.length;
            const status = statusUi(eventItem.status);

            return (
              <article
                key={eventItem.id}
                className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-6 transition duration-200 ease-in-out hover:border-[#C9973A]/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="nt-heading text-2xl text-[#F7F6F3]">{eventItem.title}</h2>
                    <p className="mt-2 text-sm text-[#888888]">
                      {toFrenchDate(eventItem.date)} · {toHour(eventItem.start_time)}
                      {eventItem.end_time ? ` — ${toHour(eventItem.end_time)}` : ""}
                    </p>
                  </div>
                  <span className={`rounded-md px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {eventItem.dj_lineup.length > 0 ? (
                    eventItem.dj_lineup.map((dj) => (
                      <span
                        key={`${eventItem.id}-${dj}`}
                        className="rounded-md border border-[#C9973A]/40 bg-[#C9973A]/12 px-2.5 py-1 text-xs font-medium text-[#E8C96A]"
                      >
                        {dj}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-md border border-[#888888]/35 bg-[#888888]/10 px-2.5 py-1 text-xs text-[#888888]">
                      DJ lineup non défini
                    </span>
                  )}
                </div>

                <div className="mt-5 rounded-lg border border-[#C9973A]/15 bg-[#0A0F2E] p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Disponibilité tables</p>
                  <p className="mt-2 text-sm text-[#F7F6F3]">
                    <span className="font-semibold text-[#E8C96A]">{availableCount}</span> disponibles sur {totalCount}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
