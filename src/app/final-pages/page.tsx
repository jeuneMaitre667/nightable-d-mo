import Link from "next/link";

type PageItem = {
  label: string;
  path: string;
  status: "live" | "planned";
  note?: string;
};

type Section = {
  title: string;
  description: string;
  pages: PageItem[];
};

const sections: Section[] = [
  {
    title: "Public",
    description: "Parcours découverte et acquisition.",
    pages: [
      { label: "Landing", path: "/", status: "live" },
      { label: "Démo produit", path: "/demo", status: "live" },
      { label: "Roadmap interactive", path: "/build-plan", status: "live" },
      { label: "Club public (slug)", path: "/clubs/l-arc-paris", status: "live" },
      { label: "Réservation publique", path: "/reserve", status: "live" },
      { label: "Liste des clubs", path: "/clubs", status: "planned" },
      { label: "Toutes les pages finales", path: "/final-pages", status: "live" },
    ],
  },
  {
    title: "Auth",
    description: "Onboarding et authentification multi-rôles.",
    pages: [
      { label: "Connexion", path: "/login", status: "live" },
      { label: "Inscription", path: "/register", status: "live" },
      { label: "Vérification email", path: "/verify", status: "live" },
    ],
  },
  {
    title: "Dashboard Client",
    description: "Expérience client finalisée après connexion.",
    pages: [
      { label: "Accueil client", path: "/dashboard/client", status: "live" },
      { label: "Mes réservations", path: "/dashboard/client/reservations", status: "planned" },
      { label: "Mes waitlists", path: "/dashboard/client/waitlist", status: "planned" },
      { label: "Profil & score", path: "/dashboard/client/profile", status: "planned" },
      { label: "Historique & factures", path: "/dashboard/client/billing", status: "planned" },
    ],
  },
  {
    title: "Dashboard Club",
    description: "Pilotage opérationnel et business du club.",
    pages: [
      { label: "Accueil club", path: "/dashboard/club", status: "live" },
      { label: "Événements", path: "/dashboard/club/events", status: "planned" },
      { label: "Tables & plan de salle", path: "/dashboard/club/tables", status: "planned" },
      { label: "Réservations", path: "/dashboard/club/reservations", status: "planned" },
      { label: "Promoteurs", path: "/dashboard/club/promoters", status: "planned" },
      { label: "Femmes VIP", path: "/dashboard/club/vip", status: "planned" },
      { label: "Analytics", path: "/dashboard/club/analytics", status: "planned" },
      { label: "Settings", path: "/dashboard/club/settings", status: "planned" },
    ],
  },
  {
    title: "Dashboard Promoteur",
    description: "Acquisition, guest list et commissions.",
    pages: [
      { label: "Accueil promoteur", path: "/dashboard/promoter", status: "live" },
      { label: "Guest list", path: "/dashboard/promoter/guestlist", status: "planned" },
      { label: "Commissions", path: "/dashboard/promoter/commissions", status: "planned" },
      { label: "Performance liens", path: "/dashboard/promoter/performance", status: "planned" },
    ],
  },
  {
    title: "Dashboard VIP",
    description: "Parcours femmes validées et invitations.",
    pages: [
      { label: "Accueil VIP", path: "/dashboard/vip", status: "live" },
      { label: "Invitations", path: "/dashboard/vip/invitations", status: "planned" },
      { label: "Profil VIP", path: "/dashboard/vip/profile", status: "planned" },
      { label: "Historique sorties", path: "/dashboard/vip/history", status: "planned" },
    ],
  },
  {
    title: "Admin",
    description: "Supervision globale produit et modération.",
    pages: [
      { label: "Accueil admin", path: "/dashboard/admin", status: "live" },
      { label: "Gestion utilisateurs", path: "/dashboard/admin/users", status: "planned" },
      { label: "Gestion clubs", path: "/dashboard/admin/clubs", status: "planned" },
      { label: "Conformité & sécurité", path: "/dashboard/admin/security", status: "planned" },
    ],
  },
];

function statusBadge(status: PageItem["status"]) {
  if (status === "live") {
    return <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">Live</span>;
  }
  return <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">Planned</span>;
}

export default function FinalPagesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/50 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Plan final</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Toutes les pages de la version finale</h1>
          <p className="mt-4 max-w-4xl text-zinc-300">
            Cette page te donne la vision complète du produit final: toutes les routes prévues, leur rôle dans le parcours
            et leur statut actuel de livraison.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-emerald-300">Live: déjà disponible</span>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-amber-300">Planned: prévu en version finale</span>
            <Link href="/build-plan" className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-200">
              Ouvrir la roadmap interactive
            </Link>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm text-zinc-300">{section.description}</p>

              <div className="mt-4 space-y-2">
                {section.pages.map((page) => (
                  <article key={`${section.title}-${page.path}`} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{page.label}</p>
                        <p className="text-sm text-zinc-400">{page.path}</p>
                        {page.note ? <p className="mt-1 text-xs text-zinc-500">{page.note}</p> : null}
                      </div>
                      <div className="shrink-0">{statusBadge(page.status)}</div>
                    </div>

                    {page.status === "live" ? (
                      <Link href={page.path} className="mt-3 inline-block text-sm text-zinc-200 underline">
                        Ouvrir la page
                      </Link>
                    ) : null}
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
