import Link from "next/link";

const pinnedEvent = {
  title: "Fashion Week Afterparty · Invite Priority",
  club: "L'Arc Paris",
  date: "Sam 07 Mars · 23:30",
  tags: ["VIP", "Hip-Hop", "House"],
  tables: "3 tables premium restantes",
};

const daySections = [
  {
    label: "SAM 07 MARS",
    items: [
      { title: "Midnight Society", club: "Raspoutine", time: "23:45", price: "Min. conso 900€", genre: "Afro House", occupancy: "84%" },
      { title: "Noir Signature", club: "Bridge Club", time: "23:00", price: "Min. conso 650€", genre: "Hip-Hop", occupancy: "72%" },
      { title: "Gold Room Exclusive", club: "Taboo", time: "00:15", price: "Min. conso 1200€", genre: "Open Format", occupancy: "91%" },
    ],
  },
  {
    label: "DIM 08 MARS",
    items: [
      { title: "Sunday Members Only", club: "Le Duplex", time: "23:30", price: "Min. conso 500€", genre: "R&B", occupancy: "68%" },
      { title: "Velvet Closing", club: "Manko", time: "23:59", price: "Min. conso 1100€", genre: "Latin House", occupancy: "88%" },
    ],
  },
];

const clubPainPoints = [
  "Remplissage des tables VIP trop dépendant de WhatsApp/Instagram",
  "No-show et annulations de dernière minute non absorbés",
  "Pilotage promoteurs sans traçabilité ni données de performance",
];

const nightTableAnswers = [
  "Flux de réservation centralisé avec état des tables en temps réel",
  "Prépaiement systématique pour sécuriser le revenu minimum conso",
  "Guest list et attribution promoteur digitalisées dans un seul dashboard",
];

const popularClubs = ["L'Arc Paris", "Raspoutine", "Bridge Club", "Taboo", "Manko", "Le Duplex"];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Demo produit</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold md:text-5xl">Événements & tables VIP à Paris</h1>
              <p className="mt-3 max-w-3xl text-zinc-300">
                Modèle inspiré des marketplaces événementielles, adapté à la vraie problématique des clubs parisiens:
                maximiser le remplissage table et fiabiliser l&apos;opérationnel promoteurs.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm">
              <p className="text-zinc-400">Ville</p>
              <p className="font-semibold">Paris · 126 soirées en ligne</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-zinc-700 px-3 py-1">Par musique</span>
            <span className="rounded-full border border-zinc-700 px-3 py-1">Par date</span>
            <span className="rounded-full border border-zinc-700 px-3 py-1">Tables VIP</span>
            <span className="rounded-full border border-zinc-700 px-3 py-1">Promoteur tracké</span>
            <span className="rounded-full border border-zinc-700 px-3 py-1">No-show maîtrisé</span>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Épinglé</p>
              <h2 className="mt-2 text-2xl font-semibold">{pinnedEvent.title}</h2>
              <p className="mt-1 text-zinc-300">{pinnedEvent.club} · {pinnedEvent.date}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {pinnedEvent.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-1">{tag}</span>
                ))}
              </div>
              <p className="mt-4 rounded-md border border-emerald-700/50 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-300">
                {pinnedEvent.tables}
              </p>
            </section>

            {daySections.map((section) => (
              <section key={section.label} className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-300">{section.label}</h3>
                {section.items.map((event) => (
                  <article key={`${section.label}-${event.title}`} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-zinc-400">{event.club}</p>
                        <h4 className="text-lg font-semibold">{event.title}</h4>
                        <p className="mt-1 text-sm text-zinc-300">{event.time} · {event.genre}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-zinc-100">{event.price}</p>
                        <p className="mt-1 text-zinc-400">Remplissage {event.occupancy}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="text-base font-semibold">Problème clubs à Paris</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {clubPainPoints.map((point) => (
                  <li key={point} className="rounded-md bg-zinc-800 px-3 py-2">{point}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="text-base font-semibold">Réponse NightTable</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {nightTableAnswers.map((point) => (
                  <li key={point} className="rounded-md bg-zinc-800 px-3 py-2">{point}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="text-base font-semibold">Clubs populaires · Paris</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {popularClubs.map((club) => (
                  <span key={club} className="rounded-full border border-zinc-700 px-2.5 py-1">{club}</span>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="text-base font-semibold">Actions</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <Link href="/register" className="rounded-md bg-white px-3 py-2 text-center text-black">Tester l&apos;inscription</Link>
                <Link href="/dashboard/club" className="rounded-md border border-zinc-700 px-3 py-2 text-center">Dashboard Club</Link>
                <Link href="/dashboard/promoter" className="rounded-md border border-zinc-700 px-3 py-2 text-center">Dashboard Promoteur</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
