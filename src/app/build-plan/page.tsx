"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Priority = "P0" | "P1" | "P2";
type Status = "ready" | "next" | "later";
type RoleFilter = "all" | "public" | "auth" | "client" | "club" | "promoter" | "vip" | "admin" | "cross";

type PlanItem = {
  title: string;
  route: string;
  priority: Priority;
  estimate: string;
  dependency?: string;
  status: Status;
  role: Exclude<RoleFilter, "all">;
  phase: string;
};

const items: PlanItem[] = [
  { title: "Landing finale", route: "/", priority: "P0", estimate: "0.5 j", status: "ready", role: "public", phase: "Phase 1" },
  { title: "Login premium UI", route: "/login", priority: "P0", estimate: "0.5 j", status: "next", role: "auth", phase: "Phase 1" },
  { title: "Register premium UI", route: "/register", priority: "P0", estimate: "0.5 j", dependency: "Login premium UI", status: "next", role: "auth", phase: "Phase 1" },
  { title: "Verify flow + messages", route: "/verify", priority: "P1", estimate: "0.5 j", dependency: "Register premium UI", status: "next", role: "auth", phase: "Phase 1" },
  { title: "Page clubs index", route: "/clubs", priority: "P1", estimate: "1 j", status: "next", role: "public", phase: "Phase 1" },
  { title: "Page club publique", route: "/clubs/l-arc-paris", priority: "P0", estimate: "0.5 j", status: "ready", role: "public", phase: "Phase 1" },
  { title: "Reserve page complete", route: "/reserve", priority: "P0", estimate: "1 j", status: "next", role: "public", phase: "Phase 2" },
  { title: "Client dashboard shell", route: "/dashboard/client", priority: "P0", estimate: "1 j", status: "ready", role: "client", phase: "Phase 2" },
  { title: "Client reservations page", route: "/dashboard/client/reservations", priority: "P0", estimate: "1 j", dependency: "Reserve page complete", status: "next", role: "client", phase: "Phase 2" },
  { title: "Stripe payment flow UI", route: "/reserve", priority: "P0", estimate: "1 j", dependency: "Reserve page complete", status: "next", role: "cross", phase: "Phase 2" },
  { title: "Club dashboard UX", route: "/dashboard/club", priority: "P0", estimate: "1 j", status: "ready", role: "club", phase: "Phase 3" },
  { title: "Club events page", route: "/dashboard/club/events", priority: "P0", estimate: "1 j", status: "next", role: "club", phase: "Phase 3" },
  { title: "Club tables / floor plan", route: "/dashboard/club/tables", priority: "P0", estimate: "1.5 j", dependency: "Club events page", status: "next", role: "club", phase: "Phase 3" },
  { title: "Club reservations board", route: "/dashboard/club/reservations", priority: "P0", estimate: "1 j", dependency: "Client reservations page", status: "next", role: "club", phase: "Phase 3" },
  { title: "Club analytics v1", route: "/dashboard/club/analytics", priority: "P1", estimate: "1 j", status: "later", role: "club", phase: "Phase 3" },
  { title: "Promoter guestlist UI", route: "/dashboard/promoter/guestlist", priority: "P1", estimate: "1 j", status: "later", role: "promoter", phase: "Phase 4" },
  { title: "Promoter commissions", route: "/dashboard/promoter/commissions", priority: "P1", estimate: "1 j", dependency: "Promoter guestlist UI", status: "later", role: "promoter", phase: "Phase 4" },
  { title: "VIP invitations", route: "/dashboard/vip/invitations", priority: "P1", estimate: "1 j", status: "later", role: "vip", phase: "Phase 4" },
  { title: "Admin users & clubs", route: "/dashboard/admin", priority: "P1", estimate: "1 j", status: "later", role: "admin", phase: "Phase 4" },
  { title: "AI assistant UX", route: "/demo", priority: "P2", estimate: "1 j", status: "later", role: "cross", phase: "Phase 4" },
];

const roleFilters: { key: RoleFilter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "public", label: "Public" },
  { key: "auth", label: "Auth" },
  { key: "client", label: "Client" },
  { key: "club", label: "Club" },
  { key: "promoter", label: "Promoteur" },
  { key: "vip", label: "VIP" },
  { key: "admin", label: "Admin" },
  { key: "cross", label: "Transverse" },
];

function badgePriority(priority: Priority) {
  if (priority === "P0") {
    return <span className="rounded-full border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 text-xs text-rose-300">P0</span>;
  }
  if (priority === "P1") {
    return <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">P1</span>;
  }
  return <span className="rounded-full border border-sky-500/40 bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300">P2</span>;
}

function badgeStatus(status: Status) {
  if (status === "ready") {
    return <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">Ready</span>;
  }
  if (status === "next") {
    return <span className="rounded-full border border-violet-500/40 bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">Next</span>;
  }
  return <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-2 py-0.5 text-xs text-zinc-300">Later</span>;
}

function columnTitle(status: Status) {
  if (status === "ready") return "Now";
  if (status === "next") return "Next";
  return "Later";
}

function statusBorder(status: Status) {
  if (status === "ready") return "border-emerald-700/40";
  if (status === "next") return "border-violet-700/40";
  return "border-zinc-700/60";
}

export default function BuildPlanPage() {
  const [activeRole, setActiveRole] = useState<RoleFilter>("all");

  const filtered = useMemo(() => {
    if (activeRole === "all") return items;
    return items.filter((item) => item.role === activeRole);
  }, [activeRole]);

  const byStatus = useMemo(() => {
    return {
      ready: filtered.filter((item) => item.status === "ready"),
      next: filtered.filter((item) => item.status === "next"),
      later: filtered.filter((item) => item.status === "later"),
    };
  }, [filtered]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-fuchsia-950/50 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Build Plan</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Roadmap interactive des pages finales</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">Vue Kanban avec filtres par rôle pour prioriser ce qu’on construit maintenant, ensuite, puis plus tard.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1 text-rose-300">P0: critique</span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-amber-300">P1: important</span>
            <span className="rounded-full border border-sky-500/40 bg-sky-500/20 px-3 py-1 text-sky-300">P2: confort</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {roleFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveRole(filter.key)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  activeRole === filter.key
                    ? "border-white bg-white text-black"
                    : "border-zinc-700 bg-zinc-900 text-zinc-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {(["ready", "next", "later"] as Status[]).map((status) => (
            <section key={status} className={`rounded-2xl border bg-zinc-900 p-4 ${statusBorder(status)}`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{columnTitle(status)}</h2>
                <span className="text-sm text-zinc-400">{byStatus[status].length} items</span>
              </div>

              <div className="space-y-3">
                {byStatus[status].map((item) => (
                  <article key={`${item.phase}-${item.title}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {badgePriority(item.priority)}
                      {badgeStatus(item.status)}
                      <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">{item.phase}</span>
                    </div>

                    <h3 className="mt-2 font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{item.route}</p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
                      <span className="rounded-md border border-zinc-700 px-2 py-1">Estimation: {item.estimate}</span>
                      {item.dependency ? <span className="rounded-md border border-zinc-700 px-2 py-1">Dépend de: {item.dependency}</span> : null}
                    </div>

                    <div className="mt-3">
                      <Link
                        href={item.route.startsWith("/dashboard") || item.route.includes("[slug]") ? "/final-pages" : item.route}
                        className="text-sm underline"
                      >
                        Ouvrir
                      </Link>
                    </div>
                  </article>
                ))}

                {byStatus[status].length === 0 ? (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                    Aucun item pour ce filtre.
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
