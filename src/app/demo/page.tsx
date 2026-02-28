import Link from "next/link";

const tonightEvents = [
  { club: "L'Arc Paris", title: "Saturday Signature", area: "Champs-Élysées", occupancy: "89%", tablesLeft: 4 },
  { club: "Raspoutine", title: "Midnight Society", area: "8e", occupancy: "74%", tablesLeft: 7 },
  { club: "Manko", title: "Latin Night", area: "Avenue Montaigne", occupancy: "92%", tablesLeft: 2 },
];

const rolePanels = [
  { role: "Client", summary: "Recherche, réservation, suivi des soirées", kpi: "3 réservations ce mois" },
  { role: "Club", summary: "Gestion événements, tables, guest live", kpi: "CA soir estimé: 12 450€" },
  { role: "Promoteur", summary: "Lien tracké, guest list, commissions", kpi: "37 invités ajoutés" },
  { role: "Femme VIP", summary: "Invitations reçues, validation profil", kpi: "5 invitations actives" },
  { role: "Admin", summary: "Pilotage global plateforme et comptes", kpi: "27 clubs actifs" },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">NightTable Demo</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">Vision produit finale — aperçu visuel</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Cette démo montre l&apos;expérience cible du produit: découverte de soirées, dashboards multi-rôles,
            pilotage club et exécution opérationnelle promoteur.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-md bg-white px-4 py-2 text-black">Tester l&apos;inscription</Link>
            <Link href="/dashboard/club" className="rounded-md border border-zinc-600 px-4 py-2">Voir dashboard club</Link>
            <Link href="/dashboard/promoter" className="rounded-md border border-zinc-600 px-4 py-2">Voir dashboard promoteur</Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {tonightEvents.map((event) => (
            <article key={event.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-400">{event.club}</p>
              <h2 className="mt-1 text-xl font-semibold">{event.title}</h2>
              <p className="mt-2 text-sm text-zinc-300">{event.area}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-zinc-800 px-3 py-2">Remplissage: {event.occupancy}</div>
                <div className="rounded-md bg-zinc-800 px-3 py-2">Tables: {event.tablesLeft}</div>
              </div>
            </article>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Cockpit par rôle</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rolePanels.map((panel) => (
              <article key={panel.role} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <p className="text-sm uppercase tracking-wide text-zinc-400">{panel.role}</p>
                <p className="mt-2 text-zinc-200">{panel.summary}</p>
                <p className="mt-4 rounded-md bg-zinc-800 px-3 py-2 text-sm">{panel.kpi}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold">Parcours lancement (MVP)</h2>
          <ol className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
            <li className="rounded-md bg-zinc-800 px-3 py-2">1. Club crée événement et tables</li>
            <li className="rounded-md bg-zinc-800 px-3 py-2">2. Promoteur alimente la guest list</li>
            <li className="rounded-md bg-zinc-800 px-3 py-2">3. Client réserve sa table</li>
            <li className="rounded-md bg-zinc-800 px-3 py-2">4. Check-in opéré côté club</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
