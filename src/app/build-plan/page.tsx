import Link from "next/link";

type Priority = "P0" | "P1" | "P2";
type Status = "ready" | "next" | "later";

type PlanItem = {
  title: string;
  route: string;
  priority: Priority;
  estimate: string;
  dependency?: string;
  status: Status;
};

type PlanPhase = {
  name: string;
  objective: string;
  sprint: string;
  items: PlanItem[];
};

const phases: PlanPhase[] = [
  {
    name: "Phase 1 — Acquisition & Auth",
    sprint: "Semaine 1",
    objective: "Transformer les visiteurs en utilisateurs inscrits.",
    items: [
      { title: "Landing finale", route: "/", priority: "P0", estimate: "0.5 j", status: "ready" },
      { title: "Login premium UI", route: "/login", priority: "P0", estimate: "0.5 j", status: "next" },
      { title: "Register premium UI", route: "/register", priority: "P0", estimate: "0.5 j", dependency: "Login premium UI", status: "next" },
      { title: "Verify flow + messages", route: "/verify", priority: "P1", estimate: "0.5 j", dependency: "Register premium UI", status: "next" },
      { title: "Page clubs index", route: "/clubs", priority: "P1", estimate: "1 j", status: "next" },
      { title: "Page club publique", route: "/clubs/[slug]", priority: "P0", estimate: "0.5 j", status: "ready" },
    ],
  },
  {
    name: "Phase 2 — Core Reservation",
    sprint: "Semaine 2",
    objective: "Permettre la réservation table de bout en bout.",
    items: [
      { title: "Reserve page complete", route: "/reserve", priority: "P0", estimate: "1 j", status: "next" },
      { title: "Client dashboard shell", route: "/dashboard/client", priority: "P0", estimate: "1 j", status: "ready" },
      { title: "Client reservations page", route: "/dashboard/client/reservations", priority: "P0", estimate: "1 j", dependency: "Reserve page complete", status: "next" },
      { title: "Stripe payment flow UI", route: "/reserve", priority: "P0", estimate: "1 j", dependency: "Reserve page complete", status: "next" },
    ],
  },
  {
    name: "Phase 3 — Club Operations",
    sprint: "Semaine 3",
    objective: "Donner au club un cockpit opérationnel complet.",
    items: [
      { title: "Club dashboard UX", route: "/dashboard/club", priority: "P0", estimate: "1 j", status: "ready" },
      { title: "Club events page", route: "/dashboard/club/events", priority: "P0", estimate: "1 j", status: "next" },
      { title: "Club tables / floor plan", route: "/dashboard/club/tables", priority: "P0", estimate: "1.5 j", dependency: "Club events page", status: "next" },
      { title: "Club reservations board", route: "/dashboard/club/reservations", priority: "P0", estimate: "1 j", dependency: "Client reservations page", status: "next" },
      { title: "Club analytics v1", route: "/dashboard/club/analytics", priority: "P1", estimate: "1 j", status: "later" },
    ],
  },
  {
    name: "Phase 4 — Growth Modules",
    sprint: "Semaine 4",
    objective: "Activer les leviers réseau: promoteurs, VIP, IA.",
    items: [
      { title: "Promoter guestlist UI", route: "/dashboard/promoter/guestlist", priority: "P1", estimate: "1 j", status: "later" },
      { title: "Promoter commissions", route: "/dashboard/promoter/commissions", priority: "P1", estimate: "1 j", dependency: "Promoter guestlist UI", status: "later" },
      { title: "VIP invitations", route: "/dashboard/vip/invitations", priority: "P1", estimate: "1 j", status: "later" },
      { title: "AI assistant UX", route: "/demo", priority: "P2", estimate: "1 j", status: "later" },
    ],
  },
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

export default function BuildPlanPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-fuchsia-950/50 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Build Plan</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Roadmap interactive des pages finales</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Ordre de construction page par page avec priorité, estimation et dépendances. Ce plan est pensé pour livrer
            rapidement une V1 cohérente et monétisable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1 text-rose-300">P0: critique</span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-amber-300">P1: important</span>
            <span className="rounded-full border border-sky-500/40 bg-sky-500/20 px-3 py-1 text-sky-300">P2: confort</span>
          </div>
        </section>

        <div className="grid gap-4">
          {phases.map((phase) => (
            <section key={phase.name} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{phase.name}</h2>
                  <p className="mt-1 text-sm text-zinc-300">{phase.objective}</p>
                </div>
                <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
                  {phase.sprint}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {phase.items.map((item) => (
                  <article key={`${phase.name}-${item.title}`} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {badgePriority(item.priority)}
                      {badgeStatus(item.status)}
                    </div>
                    <h3 className="mt-2 font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{item.route}</p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-300">
                      <span className="rounded-md border border-zinc-700 px-2 py-1">Estimation: {item.estimate}</span>
                      {item.dependency ? (
                        <span className="rounded-md border border-zinc-700 px-2 py-1">Dépend de: {item.dependency}</span>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <Link href={item.route.startsWith("/dashboard") || item.route.includes("[slug]") ? "/final-pages" : item.route} className="text-sm underline">
                        Ouvrir
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
