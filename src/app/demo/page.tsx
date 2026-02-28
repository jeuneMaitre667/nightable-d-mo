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
      { title: "Midnight Society", club: "Raspoutine", time: "23:45", price: "Min. conso 900€", genre: "Afro House", occupancy: "84%", image: "https://images.unsplash.com/photo-1574391884720-bbc7d4f6f444?auto=format&fit=crop&w=1200&q=80" },
      { title: "Noir Signature", club: "Bridge Club", time: "23:00", price: "Min. conso 650€", genre: "Hip-Hop", occupancy: "72%", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80" },
      { title: "Gold Room Exclusive", club: "Taboo", time: "00:15", price: "Min. conso 1200€", genre: "Open Format", occupancy: "91%", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80" },
    ],
  },
  {
    label: "DIM 08 MARS",
    items: [
      { title: "Sunday Members Only", club: "Le Duplex", time: "23:30", price: "Min. conso 500€", genre: "R&B", occupancy: "68%", image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80" },
      { title: "Velvet Closing", club: "Manko", time: "23:59", price: "Min. conso 1100€", genre: "Latin House", occupancy: "88%", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80" },
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

const productModules = [
  { title: "Client App", detail: "Découverte soirées, sélection table, paiement sécurisé, QR check-in." },
  { title: "Club Console", detail: "Pilotage events, tables, réservations et performance en temps réel." },
  { title: "Promoter Suite", detail: "Liens trackés, guest list mobile, suivi conversion et commissions." },
  { title: "VIP Experience", detail: "Validation profils, invitations privées et parcours sécurité." },
  { title: "Payments & Ops", detail: "Prépaiement Stripe, webhook de confirmation, anti no-show." },
  { title: "AI Concierge", detail: "Bot de réservation intelligent avec contexte live clubs/events." },
];

const finalFlow = [
  "Client découvre une soirée (style, budget, quartier).",
  "Sélection table via disponibilités live + prix dynamique.",
  "Prépaiement Stripe et confirmation instantanée (email/SMS).",
  "Assignation promoteur si lien promo utilisé.",
  "Check-in QR au club puis suivi post-soirée.",
];

const kpiPreview = [
  { label: "Clubs partenaires", value: "30" },
  { label: "Réservations / mois", value: "1 200" },
  { label: "Taux no-show", value: "< 6%" },
  { label: "Conversion promo", value: "+22%" },
];

const visualCollections = [
  {
    title: "Nuits électro premium",
    subtitle: "Focus conversion rapide",
    image: "https://images.unsplash.com/photo-1428988449731-1d8d7ac0b2dd?auto=format&fit=crop&w=1200&q=80",
    tone: "from-fuchsia-500/80 to-violet-700/80",
  },
  {
    title: "Expérience VIP table",
    subtitle: "Storytelling club + brand",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80",
    tone: "from-amber-400/80 to-rose-600/80",
  },
  {
    title: "Parcours mobile first",
    subtitle: "Réserver en moins de 90 sec",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    tone: "from-cyan-400/80 to-indigo-700/80",
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/50 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Demo produit</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold md:text-5xl">Événements & tables VIP à Paris</h1>
              <p className="mt-3 max-w-3xl text-zinc-300">
                Modèle inspiré des marketplaces événementielles, adapté à la vraie problématique des clubs parisiens:
                maximiser le remplissage table et fiabiliser l&apos;opérationnel promoteurs.
              </p>
            </div>
            <div className="rounded-xl border border-violet-500/50 bg-violet-950/40 px-4 py-3 text-sm backdrop-blur">
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

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kpiPreview.map((item) => (
              <div key={item.label} className="rounded-xl border border-zinc-700/70 bg-zinc-950/70 p-3 backdrop-blur">
                <p className="text-xs text-zinc-400">{item.label}</p>
                <p className="mt-1 text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {visualCollections.map((item) => (
            <article
              key={item.title}
              className="relative min-h-44 overflow-hidden rounded-2xl border border-zinc-800"
              style={{ backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />
              <div className="absolute inset-0 bg-black/35" />
              <div className="relative p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-200">Collection</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-100">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Vision produit final</p>
          <h2 className="mt-2 text-2xl font-semibold">Un système complet, pas juste une billetterie</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {productModules.map((module) => (
              <article key={module.title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <h3 className="font-semibold">{module.title}</h3>
                <p className="mt-1 text-sm text-zinc-300">{module.detail}</p>
              </article>
            ))}
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
                  <article
                    key={`${section.label}-${event.title}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(24,24,27,0.92), rgba(24,24,27,0.78)), url(${event.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-zinc-400">{event.club}</p>
                        <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                        <p className="mt-1 text-sm text-zinc-200">{event.time} · {event.genre}</p>
                      </div>
                      <div className="rounded-md border border-zinc-700 bg-zinc-900/70 p-2 text-right text-sm backdrop-blur">
                        <p className="font-semibold text-zinc-100">{event.price}</p>
                        <p className="mt-1 text-zinc-300">Remplissage {event.occupancy}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="text-base font-semibold">Parcours final NightTable</h3>
              <ol className="mt-3 space-y-2 text-sm text-zinc-300">
                {finalFlow.map((step) => (
                  <li key={step} className="rounded-md bg-zinc-800 px-3 py-2">{step}</li>
                ))}
              </ol>
            </section>

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
                <Link href="/dashboard/client" className="rounded-md border border-zinc-700 px-3 py-2 text-center">Expérience Client</Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
